import { default as parseLog, DamageSummary, makeCloneable, ICullingParser } from 'culling-log-parser';

// fake loading bar 4Head
let fakeProgress = 0;
function fakeProgressIncrementor () {
  const remaining = 100 - fakeProgress;
  fakeProgress += remaining * 0.01;
  return fakeProgress;
};

function handleFile(
  file: File,
  progressHandler: (this: FileReader, percent: number) => any,
  successHandler: (this: FileReader, data: ICullingParser.IParseLogOutput) => any,
  errorHandler: (this: FileReader, ev: ErrorEvent|Error) => any
): void {
  const reader = new FileReader();
  reader.readAsText(file);

  reader.onprogress = (progressEvent: ProgressEvent) => {
    let progress = 0;
    if (progressEvent.lengthComputable) {
      progress = progressEvent.loaded / progressEvent.total * 100;
    } else {
      // fake it!
      console.log('Faking progress');
      progress = fakeProgressIncrementor();
    }
    progress = progress / 2; // divide by two, because these events only count for the filereading itself for now
    progressHandler.call(reader, progress);
  };

  reader.onload = (event) => {
    let result: ICullingParser.IParseLogOutput;
    try {
      result = parseLog(reader.result, { ignoreBots: true });
    } catch (e) {
      errorHandler.call(reader, e);
      return;
    }
    successHandler.call(reader, result);
  };

  reader.onerror = errorHandler;

}

function fastConcat(array: Array<any>, otherArray: Array<any>) {
  otherArray.forEach((v) => array.push(v));
}


onmessage = (event) => {
  const files: Array<File> = event.data;

  const totalResult: ICullingParser.IParseLogOutput = {
    end: new Date(0),
    entries: [],
    games: [],
    meta: {
      lines: {
        relevant: 0,
        total: 0,
      },
    },
    players: {},
    start: new Date(),
    summary: {
      damage: new DamageSummary(),
      deaths: 0,
      kills: 0,
      losses: 0,
      wins: 0,
    },
  };

  const fileSerialHandler: any = (index: number) => {
    const arrayProgress = index / files.length * 100;
    handleFile(
      files[index],

      (progress: number) => {
        postMessage({
          progress: arrayProgress + progress / files.length,
          type: 'progress',
        });
      },

      (output) => {
        try {
          let beforeLast = false;
          if (output.start < totalResult.start) {
            totalResult.start = output.start;
            beforeLast = true;
          }
          if (output.end > totalResult.end) {
            if (index > 0 && beforeLast) {
              console.warn('A log file was before and after the already parsed output.', files[index - 1].name,
                'output.end', output.end, 'output.start', output.start, 'totalResult.end', totalResult.end,
                'totalResult.start', totalResult.start);
            }
            totalResult.end = output.end;
          }

          fastConcat(totalResult.entries, output.entries);
          fastConcat(totalResult.games, output.games);
          totalResult.meta.lines.relevant += output.meta.lines.relevant;
          totalResult.meta.lines.total += output.meta.lines.total;

          Object.keys(output.players).forEach((name) => {
            let player = totalResult.players[name];
            if (!player) {
              player = output.players[name];
            } else {
              player.damage = player.damage.addOtherSummary(output.players[name].damage);
              player.killed += output.players[name].killed;
              player.died += output.players[name].died;
              player.timesMet += output.players[name].timesMet;
            }
          });

          totalResult.summary.damage = totalResult.summary.damage.addOtherSummary(output.summary.damage);
          totalResult.summary.deaths += output.summary.deaths;
          totalResult.summary.kills += output.summary.kills;
          totalResult.summary.losses += output.summary.losses;
          totalResult.summary.wins += output.summary.wins;

          index++;
          if (files[index]) {
            // get more files
            fileSerialHandler(index);
          } else {
            postMessage({
              output: makeCloneable(totalResult),
              type: 'done',
            });
          }
        } catch (error) {
          postMessage({
            error: error.message,
            stack: error.stack,
            type: 'error',
          });
        }
      },

      (error: Error) => {
        console.log('Posting error');
        postMessage({
          error: error.message,
          stack: error.stack,
          type: 'error',
        });
      }
    );
  };

  fileSerialHandler(0);

  postMessage({
    type: 'started',
  });
};
