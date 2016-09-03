import * as React from 'react';
import * as Dropzone from 'react-dropzone';
import { ICullingParser } from 'culling-log-parser';


interface IProps {
  onParsed: (output: ICullingParser.IParseLogResponseCloneable) => any;
}

interface IState {
  minimized: boolean;
  inputSelected: boolean;
  files: Array<File>;
  isParsingLogs: boolean;
  parsePercent: number;
};

const defaultState: IState = {
  files: [],
  inputSelected: false,
  isParsingLogs: false,
  minimized: false,
  parsePercent: 0,
};

export default class LogDropZone extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.resetState();
  }

  private resetState() {
    if (this.state) {
      this.setState(defaultState);
    } else {
      this.state = defaultState;
    }
  }

  private onDrop(files: Array<File>) {
    if (this.state.isParsingLogs) {
      alert(`Wait for current parsing to finish!
If it's stuck you can try reloading the website.
If that doesn't help then report it as a bug, please! :-)`);
    }
    if (!files[0] || !(files[0] instanceof File)) {
      return this.onReject();
    }
    this.setState({
      files,
      isParsingLogs: true,
      parsePercent: 0,
    } as IState, () => {
      const worker = new Worker('./worker.js');
      worker.postMessage(files);

      worker.onmessage = (event: MessageEvent) => {
        if (!event.data.type) {
          console.error('Bad data from worker!');
        }
        switch (event.data.type) {
          case 'started':
            this.setState({
              parsePercent: 1,
            } as IState);
            break;
          case 'progress':
            this.setState({
              parsePercent: Math.floor(event.data.progress),
            } as IState);
            break;
          case 'done':
            this.setState({
              files: [],
              inputSelected: false,
              isParsingLogs: false,
              minimized: true,
              parsePercent: 0,
            });
            this.props.onParsed(event.data.output);
            break;
          case 'error':
            this.resetState();
            alert('Parsing the logs failed. Please throw some sticks at the code monkeys.');
            console.error('Error from worker!', event.data.stack || event.data.error);
            break;
          default:
            console.error(`Unknown type '${event.data.type}' from worker!`);
        }
      };
    });
  }

  private onReject() {
    alert('Only log files please.');
  }

  private onClickInput(e: __React.MouseEvent) {
    const target = e.target as any; // WHAT THE F.U.N.C.
    target.select();
  }


  public render() {
    let outerClassName = 'dropzone col-lg-12';
    let innerClassName = 'well';
    if (this.state.minimized) {
      innerClassName += ' well-sm';
      outerClassName += ' minimized';
    }
    const loadingClass = this.state.isParsingLogs ? 'loader loading' : 'loader';
    const loadingBarWidthStyle = { width: `${this.state.parsePercent}%` };
    return (
      <Dropzone
        onDrop={this.onDrop.bind(this)}
        className={outerClassName}
        activeClassName='dropzoneActive'
        rejectClassName='dropzoneRejected'
        onDropRejected={this.onReject.bind(this)}
        disableClick={true}
        disablePreview={true}
        accept='.log'>
        <div className={loadingClass}>
          <div className='progress progress-striped active'>
            <div className='progress-bar progress-bar-info' role='progressbar'
              aria-valuenow={this.state.parsePercent} aria-valuemin='0'
              aria-valuemax='100' style={loadingBarWidthStyle}>
                {this.state.parsePercent}%
            </div>
            { this.state.parsePercent >= 99 && <img className='grayFace' src='./images/GrayFaceNoSpace.png' /> }
          </div>
        </div>
        <div className={innerClassName}>
          <h2>Drag & Drop Victory.log files here</h2>
          <form className='form-horizontal'>
            <div className='form-group'>
              <label className='col-sm-4 control-label'>
                You can find your Culling logs here
              </label>
              <div className='col-xs-12 col-sm-5 col-md-4 col-lg-3'>
                <input className='form-control' onClick={this.onClickInput.bind(this)} selected={true} readOnly={true}
                  size={33} value='%localappdata%\\Victory\\Saved\\Logs' />
              </div>
            </div>
          </form>
          <p className='lead'>
            These files will <b>not</b> be uploaded, they will be processed in your browser and then displayed.
            When you leave this page, they are forgotten.
          </p>
        </div>
      </Dropzone>
    );
  }
}

