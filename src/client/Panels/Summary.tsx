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
    const percentMeleeBlocked = (this.props.stats.summary.damage.melee.received.meleeBlockCount
      * 100 / this.props.stats.summary.damage.melee.received.count);
    const percentMeleeBlocksHit = (this.props.stats.summary.damage.melee.dealt.meleeBlockCount
      * 100 / this.props.stats.summary.damage.melee.dealt.count);

    let highestDamage = (<div></div>);
    if (this.props.stats.entries.length > 0) {
      const highestDamageEntry = this.props.stats.entries.reduce(
        (prev, cur) => cur.damage.dealt > prev.damage.dealt ? cur : prev
      );

      let highestDamageType = 'with your fists!';
      if (highestDamageEntry.damage.isBackstab) {
        highestDamageType = 'by stabbing him in the back... you dirty monster!';
      } else if (highestDamageEntry.damage.isHeadshot) {
        highestDamageType = 'by blowing his head off. Who cleaned that up?';
      } else if (highestDamageEntry.damage.dealt > 25) {
        highestDamageType += ' (probably not)';
      }

      highestDamage = (
        <dd>
          {highestDamageEntry.damage.dealt} to "{highestDamageEntry.otherPlayer.substr(0, 5)}..." {highestDamageType}
        </dd>
      );
    }
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
              <dt>Backstabs</dt>
              <dd>{this.props.stats.summary.damage.dealt.backstabCount}</dd>
              <dt>Headshots</dt>
              <dd>{this.props.stats.summary.damage.dealt.headshotCount}</dd>
            </dl>
          </div>
        </div>
        <div className='col-sm-6 col-md-5'>
          <div className='well damage'>
            <h2>Damage</h2>
            <dl className='dl-horizontal'>
              <dt>Dealt to others</dt>
              <dd>{this.props.stats.summary.damage.dealt.amount}</dd>
              <dt>Received from others</dt>
              <dd>{this.props.stats.summary.damage.received.amount}</dd>
              <dt>Melee attacks blocked</dt>
              <dd>{percentMeleeBlocked.toFixed(1)} %</dd>
              <dt>Blocks melee attacked <br/><small>(you got stunned)</small></dt>
              <dd>{percentMeleeBlocksHit.toFixed(1)} %</dd>
              <dt>Range attacks blocked <br/><small>(reduces 50% damage)</small></dt>
              <dd>{this.props.stats.summary.damage.received.rangeBlockCount}</dd>
              <dt>Highest damage dealt</dt>
              {highestDamage}
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
