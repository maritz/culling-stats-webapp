import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { Link } from 'react-router';
import { withRouter, IRouter } from 'react-router';


interface IProps {
  router: IRouter;
  stats: ICullingParser.IParseLogResponseCloneable | null;
};

interface IState {
};

export default withRouter(class Stats extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public onClick() {
    alert('You played some games and met some players... More will come soon.');
  }

  public getNavbarClassName(path: string) {
    if (this.props.router.isActive(path, false)) {
      return 'active';
    } else {
      return '';
    }
  }

  public getNavElement(name: string, extraClassName = '') {
    const lower = name.toLowerCase();
    return (
      <li className={`${this.getNavbarClassName(lower)} ${extraClassName}`}>
        <Link to={lower}>
          {name}
        </Link>
      </li>
    );
  }

  public getNavElementConditional(name: string, extraClassName: string, value?: Array<any>) {
    if (value && value.length > 0) {
      return this.getNavElement(name, extraClassName);
    } else {
      return;
    }
  }

  public render(): JSX.Element {
    if (this.props.stats) {
      return (
        <div>
          <div className='row'>
            <div className='col-lg-12'>
              <nav className='navbar navbar-default' role='navigation'>
                <ul className='nav navbar-nav'>
                  {this.getNavElement('Summary')}
                  {this.getNavElement('Damage')}
                  {this.getNavElement('Games')}
                  {this.getNavElement('Players')}
                  {this.getNavElementConditional('Errors', 'error', this.props.stats.meta.errors)}
                  {this.getNavElementConditional('Warnings', 'warning', this.props.stats.meta.warnings)}
                </ul>
              </nav>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12 stats'>
               {this.props.children && React.cloneElement(this.props.children as any, {stats: this.props.stats})}
            </div>
          </div>
        </div>
      );
    } else {
      return (<div className='row'></div>);
    }
  }
}
);
