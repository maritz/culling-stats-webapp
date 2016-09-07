import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as lodashGet from 'lodash/get';

interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable;
};

interface IPlayerObject {
  data: ICullingParser.IPlayerDataCloneable;
  name: string;
}

interface IState {
  linkedIndex: number | null;
  startPage: number;
  players: Array<IPlayerObject>;
};
const pageSize = 25;

export default class Players extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      linkedIndex: null,
      players: Object.keys(this.props.stats.players).map((name) => {
        return {
          data: this.props.stats.players[name],
          name,
        };
      }),
      startPage: 1,
    };
  }

  private sortByNumber<TPlayer extends IPlayerObject>(
    accessor: string
  ): (a: TPlayer, b: TPlayer, order: 'desc' | 'asc') => number {
    return (a: TPlayer, b: TPlayer, order: 'desc' | 'asc'): number => {
      const aValue = lodashGet<ICullingParser.IPlayerDataCloneable, number>(a.data, accessor);
      const bValue = lodashGet<ICullingParser.IPlayerDataCloneable, number>(b.data, accessor);
      if (isNaN(aValue) || isNaN(bValue)) {
        console.error('Players.sortByNumber called with an accessor that produced non-number', accessor, a, b);
        return 0;
      }
      const diff = aValue - bValue;
      if (order === 'asc') {
        return diff;
      } else {
        return diff * -1;
      }
    };
  }

  public render(): JSX.Element {
    return (
      <div className='row players'>
        <div className='col-lg-12'>
          <div className='well'>
            <BootstrapTable
              ref='table'
              data={this.state.players}
              pagination={true}
              ignoreSinglePage={true/* this actually exists, bad typing. */}
              striped={true}
              hover={true}
              options={{
                defaultSortOrder: 'desc',
                defaultSortName: 'data.timesMet',
                page: this.state.startPage,
                sizePerPage: pageSize,
              }}>
              <TableHeaderColumn dataField='name' isKey={true} width='270' dataSort={true}
                filter={{type: 'TextFilter', placeholder: 'search', numberComparators: null as any}}>
                Name
              </TableHeaderColumn>
              <TableHeaderColumn dataField='data.timesMet' width='200'
                dataSort={true} sortFunc={this.sortByNumber('timesMet')}
                dataFormat={(x: any, row: IPlayerObject) => row.data.timesMet.toString()}>
                Times met
                <br />
                <small><small>Measured by how many games you've damaged them at least once or vice versa</small></small>
              </TableHeaderColumn>
              <TableHeaderColumn dataField='data.dealt' width='100'
                dataSort={true} sortFunc={this.sortByNumber('damage.dealt.amount')}
                 dataFormat={(x: any, row: IPlayerObject) => row.data.damage.dealt.amount.toString()}>
                Damage dealt
              </TableHeaderColumn>
              <TableHeaderColumn dataField='data.received' width='100'
                dataSort={true} sortFunc={this.sortByNumber('damage.received.amount')}
                 dataFormat={(x: any, row: IPlayerObject) => row.data.damage.received.amount.toString()}>
                Damage received
              </TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>
    );
  }
};
