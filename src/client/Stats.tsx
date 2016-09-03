import * as React from 'react';
import Summary from './Panels/Summary';
import { ICullingParser } from 'culling-log-parser';


interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable | null;
};

interface IState {
};

export default class Stats extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public onClick() {
    alert('You played some games and met some players... More will come soon.');
  }

  public render(): JSX.Element {
    if (this.props.stats) {
      return (
        <div>
          <div className='row'>
            <div className='col-lg-12'>
              <nav className='navbar navbar-default' role='navigation'>
                <ul className='nav navbar-nav'>
                  <li className='active'>
                    <a href='#'>
                      Summary
                    </a>
                  </li>
                  <li>
                    <a href='#' onClick={this.onClick}>
                      Games
                    </a>
                  </li>
                  <li>
                    <a href='#' onClick={this.onClick}>
                      Players
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12'>
              <Summary stats={this.props.stats}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (<div className='row'></div>);
    }
  }
};
