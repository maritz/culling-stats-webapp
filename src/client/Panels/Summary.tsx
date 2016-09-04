import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';

interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable;
};

interface IState {
};

export default class Summary extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const attacksBlocked = (this.props.stats.summary.damage.received.meleeBlockCount +
      this.props.stats.summary.damage.received.rangeBlockCount);
    const percentMeleeBlocked = (this.props.stats.summary.damage.melee.received.meleeBlockCount
      * 100 / this.props.stats.summary.damage.melee.received.amount);
    const totalAttacksReceived = this.props.stats.summary.damage.received.count + attacksBlocked;
    return (
      <div className='row summary'>
        <div className='col-sm-6 col-md-4'>
          <div className='well'>
            <h2>General</h2>
            <dl className='dl-horizontal'>
              <dt>Games</dt>
              <dd>{this.props.stats.games.length}</dd>
              <dt>Wins</dt>
              <dd>{this.props.stats.summary.wins}</dd>
              <dt>Losses</dt>
              <dd>{this.props.stats.summary.losses}</dd>
              <dt>Kills</dt>
              <dd>{this.props.stats.summary.kills}</dd>
              <dt>Deaths</dt>
              <dd>{this.props.stats.summary.deaths}</dd>
              <dt>Kills per Death</dt>
              <dd>{(this.props.stats.summary.kills / this.props.stats.summary.deaths).toFixed(10)}</dd>
            </dl>
          </div>
        </div>
        <div className='col-sm-6 col-md-4'>
          <div className='well damage'>
            <h2>Damage</h2>
            <dl className='dl-horizontal'>
              <dt>Dealt to others</dt>
              <dd>{this.props.stats.summary.damage.dealt.amount}</dd>
              <dt>Received from others</dt>
              <dd>{this.props.stats.summary.damage.received.amount}</dd>
              <dt>Attacks received <small>(melee and ranged)</small></dt>
              <dd>{totalAttacksReceived}</dd>
              <dt>Attacks blocked <small>(melee and ranged)</small></dt>
              <dd>{attacksBlocked}</dd>
              <dt>Melee attacks blocked</dt>
              <dd>{percentMeleeBlocked.toFixed(2)}%</dd>
              <dt>You hitting a block</dt>
              <dd>{this.props.stats.summary.damage.dealt.meleeBlockCount}</dd>
              <dt>Range attacks blocked <small>(reduces 50% damage)</small></dt>
              <dd>{this.props.stats.summary.damage.received.rangeBlockCount}</dd>
            </dl>
          </div>
        </div>
        <div className='col-sm-12 col-md-3'>
          <div className='well'>
            <h2>Streaks</h2>
            <dl className=''>
              <dt>Longest Win Streak</dt>
              <dd>soon™</dd>
              <dt>Longest Loosing Streak</dt>
              <dd>soon™</dd>
              <dt>Longest Kill Streak</dt>
              <dd>soon™</dd>
              <dt>Most games without a single kill</dt>
              <dd>soon™</dd>
            </dl>
          </div>
        </div>
      </div>
    );
  }
};
