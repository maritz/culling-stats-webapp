import parseLog from 'culling-log-parser';

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
  successHandler: (this: FileReader, data: any) => any,
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
    let result: any;
    try {
      result = parseLog(reader.result, undefined);
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

      (done) => {
        index++;
        if (files[index]) {
          fileSerialHandler(index);
          // todo: handle merging of data received.
        } else {
          try {
            postMessage({
              done,
              type: 'done',
            });
          } catch(error) {
            postMessage({
              error: error.message,
              stack: error.stack,
              type: 'error',
            });
          }
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
