import LogDropZone from './LogDropzone';
import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { withRouter, IRouter } from 'react-router';
import { ICompiledStatsSummary } from '../interfaces';

interface IProps {
  router: IRouter;
};

interface IState {
  games: Array<ICullingParser.IGame>;
  stats: ICompiledStatsSummary | null;
};

export default withRouter(class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.onParsed = this.onParsed.bind(this);
    this.onGamesParsed = this.onGamesParsed.bind(this);
    this.state = {
      games: [],
      stats: null,
    };
  }

  private onGamesParsed(games: Array<ICullingParser.IGame>) {
    this.setState({
      games: this.state.games.concat(games).sort(),
    } as IState);
  }

  private onParsed(output: ICompiledStatsSummary) {
    const overall = Object.assign(output, { games: this.state.games });
    this.setState({
      stats: overall,
    } as IState);
    this.props.router.push('/summary');
  }

  public render() {
    return (
      <div>
        <div className='row'>
          <LogDropZone onParsed={this.onParsed} onGamesParsed={this.onGamesParsed}>
          </LogDropZone>
        </div>
        {this.props.children && React.cloneElement(this.props.children as any, { stats: this.state.stats })}
      </div>
    );
  }
}
);
