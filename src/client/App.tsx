import LogDropZone from './LogDropzone';
import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { withRouter, IRouter } from 'react-router';

interface IProps {
  router: IRouter;
};

interface IState {
  stats: ICullingParser.IParseLogResponseCloneable | null;
};

export default withRouter(class App extends React.Component<IProps, IState> {


  constructor(props: IProps) {
    super(props);
    this.onParsed = this.onParsed.bind(this);
    this.state = {
      stats: null,
    };
  }

  private onParsed(output: ICullingParser.IParseLogResponseCloneable) {
    this.setState({
      stats: output,
    });
    this.props.router.push('/summary');
  }

  public render() {
    return (
      <div>
        <div className='row'>
          <LogDropZone onParsed={this.onParsed}>
          </LogDropZone>
        </div>
        {this.props.children && React.cloneElement(this.props.children as any, { stats: this.state.stats })}
      </div>
    );
  }
}
);
