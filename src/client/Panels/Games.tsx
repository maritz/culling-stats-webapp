import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as IRouter from 'react-router';

interface IProps extends IRouter.IInjectedProps {
};

interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable;
};

interface IState {
  linkedIndex: number | null;
  startPage: number;
};

function padStart(str: string, maxLength: number, fillString = ' ') {
    if (str.length >= maxLength) {
        return str;
    }

    fillString = String(fillString);
    if (fillString.length === 0) {
        fillString = ' ';
    }

    let fillLen = maxLength - str.length;
    let timesToRepeat = Math.ceil(fillLen / fillString.length);
    let truncatedStringFiller = fillString
        .repeat(timesToRepeat)
        .slice(0, fillLen);
    return truncatedStringFiller + str;
};
const pageSize = 10;

export default class Games extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      linkedIndex: null,
      startPage: 1,
    };
  }

  private endDateFormatter(date: Date, row: ICullingParser.IGame) {
    if (row.start) {
      const start = row.start.getTime();
      const end = date.getTime();
      const duration = (end - start) / 1000;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${padStart(String(minutes), 2, '0')}:${padStart(String(seconds), 2, '0')}`;
    } else {
      return '25:00';
    }
  }

  private modeFormatter(mode: ICullingParser.GameModesType, row: ICullingParser.IGame) {
    switch (mode) {
      case 'solo':
        return 'FFA';
      case 'team':
        return 'Teams';
      case 'custom':
        return 'Custom';
      default:
        return 'unknown';
    }
  }

  private winColFormatter(win: boolean, row: ICullingParser.IGame): JSX.Element {
    let className = 'glyphicon glyphicon-ok';
    let text = 'Win';
    if (!win) {
      if (row.isLoss) {
        className = 'glyphicon glyphicon-remove';
        text = 'Loss';
      } else {
        className = 'glyphicon glyphicon-pawn';
        text = 'unknown';
      }
    }
    return (
      <div>
        <span className={className}>
        </span>
        {text}
      </div>
    );
  }

  private damageDoneColFormatter(nope: void, row: ICullingParser.IGame): string {
    return '' + row.damageSummary.dealt.amount;
  }

  private damageReceivedColFormatter(nope: void, row: ICullingParser.IGame): string {
    return '' + row.damageSummary.received.amount;
  }

  private playersColFormatter(nope: void, row: ICullingParser.IGame): string {
    return Object.keys(row.players).join(', ');
  }

  private sortGenericByDiff(diff: number, order: 'desc' | 'asc') {
    if (order === 'asc') {
      return diff;
    } else {
      return diff * -1;
    }
  }

  private sortByStart(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc') {
    const diff = a.start.getTime() - b.start.getTime();
    return this.sortGenericByDiff(diff, order);
  }

  private sortByDuration(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc') {
    const aDuration = a.start.getTime() - a.end.getTime();
    const bDuration = b.start.getTime() - b.end.getTime();
    const diff = aDuration - bDuration;
    return this.sortGenericByDiff(diff, order);
  }

  private sortByKills(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc') {
    const diff = a.kills - b.kills;
    return this.sortGenericByDiff(diff, order);
  }

  private sortDamageDone(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc') {
    const diff = a.damageSummary.dealt.amount - b.damageSummary.dealt.amount;
    return this.sortGenericByDiff(diff, order);
  }

  private sortDamageReceived(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc') {
    const diff = a.damageSummary.received.amount - b.damageSummary.received.amount;
    return this.sortGenericByDiff(diff, order);
  }

  public componentWillMount() {
    let page = 1;
    // tslint:disable-next-line:no-string-literal
    if (this.props.params && this.props.params['id']) {
      // tslint:disable-next-line:no-string-literal
      let id = parseInt(this.props.params['id'], 10);
      // default sorting is inverted
      id = this.props.stats.games.length - id;
      page = Math.ceil(id / pageSize);
      const numberInPage = id % pageSize;
      this.setState({
        linkedIndex: numberInPage - 1,
        startPage: page,
      });
    }
  }

  public componentDidMount() {
    if (this.state.linkedIndex !== null) {
      const refs = this.refs as any;
      const row = refs.table.refs.body.refs.tbody.childNodes[this.state.linkedIndex] as Element | null;
      if (row) {
        row.scrollIntoView();
        row.classList.add('selected-via-id');
      }
    }
  }

  public render(): JSX.Element {
    return (
      <div className='row games'>
        <div className='col-lg-12'>
          <div className='well'>
            <BootstrapTable
              ref='table'
              data={this.props.stats.games}
              pagination={true}
              ignoreSinglePage={true/* this actually exists, bad typing. */}
              striped={true}
              hover={true}
              options={{
                defaultSortOrder: 'desc',
                defaultSortName: 'start',
                page: this.state.startPage,
                sizePerPage: pageSize,
              }}>
              <TableHeaderColumn dataField='id' isKey={true} width='170' hidden={true}>
                ID
              </TableHeaderColumn>
              <TableHeaderColumn dataField='start' width='170' ref='startHeader'
                dataSort={true} sortFunc={this.sortByStart.bind(this)}
                dataFormat={(date: Date) => date.toLocaleString()}>
                Start
              </TableHeaderColumn>
              <TableHeaderColumn dataField='end' dataSort={true} sortFunc={this.sortByDuration.bind(this)}
                dataFormat={this.endDateFormatter} width='110'>
                Duration
              </TableHeaderColumn>
              <TableHeaderColumn dataField='mode' dataFormat={this.modeFormatter} width='90'>
                Game mode
              </TableHeaderColumn>
              <TableHeaderColumn dataField='isWin' dataFormat={this.winColFormatter} width='90'>
                Result
              </TableHeaderColumn>
              <TableHeaderColumn dataField='kills' width='90' dataSort={true} sortFunc={this.sortByKills.bind(this)}>
                Kills
              </TableHeaderColumn>
              <TableHeaderColumn dataField='damageSummary.dealt.amount' dataFormat={this.damageDoneColFormatter}
                dataSort={true} sortFunc={this.sortDamageDone.bind(this)} width='90'>
                Damage done
              </TableHeaderColumn>
              <TableHeaderColumn dataField='damageSummary.received.amount' dataFormat={this.damageReceivedColFormatter}
                dataSort={true} sortFunc={this.sortDamageReceived.bind(this)} width='90'>
                Damage received
              </TableHeaderColumn>
              <TableHeaderColumn dataField='players[].name' dataFormat={this.playersColFormatter} width='90'>
                Players encountered
              </TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>
    );
  }
};
