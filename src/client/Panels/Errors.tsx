import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';

interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable;
};

interface IState {
};

export default class WarningsComponent extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public renderWarning(warning: string): JSX.Element {
    return (
      <li>
        {warning}
      </li>
    );
  }

  public render(): JSX.Element {
    return (
      <div className='row warnings'>
        <div className='col-lg-12'>
          <div className='panel panel-warning'>
            <ul>
              {this.props.stats.meta.errors.map(this.renderWarning)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
};
