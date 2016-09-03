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
    const totalAttacksReceived = this.props.stats.summary.damage.received.count;
    const attacksBlocked = (this.props.stats.summary.damage.received.meleeBlockCount +
      this.props.stats.summary.damage.received.meleeBlockCount);
    return (
      <div className='row'>
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
          <div className='well'>
            <h2>Damage</h2>
            <dl className='dl-horizontal'>
              <dt>Dealt to others</dt>
              <dd>{this.props.stats.summary.damage.dealt.amount}</dd>
              <dt>Received from others</dt>
              <dd>{this.props.stats.summary.damage.received.amount}</dd>
              <dt>Attacks blocked</dt>
              <dd>{attacksBlocked}</dd>
              <dt>Block rate (total attacks received / total attacks blocked)</dt>
              <dd>{(totalAttacksReceived / attacksBlocked).toFixed(2)}</dd>
              <dt>Melee hits block</dt>
              <dd>{this.props.stats.summary.damage.dealt.meleeBlockCount}</dd>
              <dt>Range attacks blocked</dt>
              <dd>{this.props.stats.summary.damage.received.rangeBlockCount}</dd>
            </dl>
          </div>
        </div>
        <div className='col-sm-12 col-md-4'>
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
