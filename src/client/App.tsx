import LogDropZone from './LogDropzone';
import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { withRouter, IRouter } from 'react-router';
import { ICompiledStatsSummary } from '../interfaces';
import * as semver from 'semver';

declare module 'react-notify-toast';
import Notifications, { notify } from 'react-notify-toast';

const currentVersion = '1.1.0';
const lastUsedVersion = localStorage.getItem('lastUsedVersion');
let showVersionHint = false;
if (lastUsedVersion && semver.gt(currentVersion, lastUsedVersion)) {
  showVersionHint = true;
} else if (!lastUsedVersion) {
  localStorage.setItem('lastUsedVersion', currentVersion);
}

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

  public componentDidMount() {
    if (showVersionHint) {
      showVersionHint = false;
      notify.show((
        <p className='version-notification success'>
          A new version has been released.
          <br/>
          You can find&nbsp;
          <a target='blank'
            href='https://github.com/maritz/culling-stats-webapp/blob/master/CHANGELOG.md'>
            the changelog here
          </a>
        </p>
      ), 'success', 8000);
      localStorage.setItem('lastUsedVersion', currentVersion);
    }
  }

  public render() {
    return (
      <div>
        <Notifications />
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
