import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';


interface IProps {
  stats: ICullingParser.IParseLogOutput | null;
};

interface IState {
};

export default class Stats extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    if (this.props.stats) {
      return (
        <div className='row'>
          <p>
            Statistics are here! Yey! Found {this.props.stats.games.length}games! :-)
          </p>
        </div>
      );
    } else {
      return (<div className='row'></div>);
    }
  }
}
