import LogDropZone from './LogDropzone';
import Stats from './Stats';
import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';

interface IProps {
};

interface IState {
  stats: ICullingParser.IParseLogOutput | null;
};

export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.onParsed = this.onParsed.bind(this);
    this.state = {
      stats: null,
    };
  }

  private onParsed(output: ICullingParser.IParseLogOutput) {
    this.setState({
      stats: output,
    });
  }

  public render() {
    return (
      <div id='content' className='container-fluid'>
        <div className='page-header'>
          <h1>
            The inofficial Early Access alpha preview for the "Culling Log Analyzer for Stats and Stuff"
            <small> or short CLASS</small>
          </h1>
        </div>
        <div className='row'>
          <LogDropZone onParsed={this.onParsed}>
          </LogDropZone>
        </div>
        <Stats stats={this.state.stats}/>
      </div>
    );
  }
}
