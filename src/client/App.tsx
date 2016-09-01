import LogDropZone from './LogDropzone';
import * as React from 'react';

interface IProps {
};

interface IState {
  isParsingLogs: boolean;
  parsePercent: number;
};

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      isParsingLogs: false,
      parsePercent: 0,
    };
  }

  private onLogDropZonFiles(files: Array<File>) {
    this.setState({
      isParsingLogs: true,
    } as IState);
    const worker = new Worker('/static/worker.js');
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
            parsePercent: event.data.progress,
          } as IState);
          break;
        case 'done':
          console.log('Received data from worker:', event.data.done);
          this.setState({
            isParsingLogs: false,
            parsePercent: 0,
          });
          break;
        case 'error':
          this.setState({
            isParsingLogs: false,
            parsePercent: 0,
          });
          console.error('Error from worker!', event.data.error);
          break;
        default:
          console.error(`Unknown type '${event.data.type}' from worker!`);
      }
    };
  }

  public render() {
    const loadingClass = this.state.isParsingLogs ? 'loader loading' : 'loader';
    const loadingBarWidthStyle = { width: `${this.state.parsePercent}%` };
    return (
      <div id='content' className='container-fluid'>
        <div className='page-header'>
          <h1>
            The inofficial Early Access alpha preview for the "Culling Log Analyzer for Stats and Stuff"
            <small> or short CLASS</small>
          </h1>
        </div>
        <div className='row'>
          <LogDropZone onFiles={this.onLogDropZonFiles.bind(this)}>
            <div className={loadingClass}>
              <div className='progress'>
                <div className='progress-bar' role='progressbar'
                  aria-valuenow={this.state.parsePercent} aria-valuemin='0'
                  aria-valuemax='100' style={loadingBarWidthStyle}>
                  <span className='sr-only'>
                    0% Complete
                  </span>
                </div>
              </div>
            </div>
          </LogDropZone>
        </div>

      </div>
    );
  }
}
