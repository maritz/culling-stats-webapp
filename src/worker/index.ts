import { default as parseLog, DamageSummary, makeCloneable, ICullingParser } from 'culling-log-parser';
import { fastConcat } from '../utils';
import { ICompiledStatsSummary } from '../interfaces';

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


onmessage = (event) => {
  const files: Array<File> = event.data;

  const totalResult: ICompiledStatsSummary = {
    end: new Date(0),
    games: [],
    highestDamageEntry: {} as ICullingParser.ILogEntry,
    meta: {
      errors: [],
      lines: {
        relevant: 0,
        total: 0,
      },
      version: 0,
      warnings: [],
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
          if (output.start < totalResult.start) {
            totalResult.start = output.start;
          }
          if (output.end > totalResult.end) {
            totalResult.end = output.end;
          }

          postMessage({
            games: output.games,
            type: 'games',
          });
          totalResult.meta.lines.relevant += output.meta.lines.relevant;
          totalResult.meta.lines.total += output.meta.lines.total;

          Object.keys(output.players).forEach((name) => {
            let player = totalResult.players[name];
            if (!player) {
              totalResult.players[name] = player = output.players[name];
            } else {
              player.damage = player.damage.addOtherSummary(output.players[name].damage);
              player.timesMet += output.players[name].timesMet;
            }
          });

          totalResult.summary.damage = totalResult.summary.damage.addOtherSummary(output.summary.damage);
          totalResult.summary.deaths += output.summary.deaths;
          totalResult.summary.kills += output.summary.kills;
          totalResult.summary.losses += output.summary.losses;
          totalResult.summary.wins += output.summary.wins;
          fastConcat(totalResult.meta.errors, output.meta.errors);
          fastConcat(totalResult.meta.warnings, output.meta.warnings);

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
