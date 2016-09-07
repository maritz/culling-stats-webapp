import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';

interface IProps {
  stats: ICullingParser.IParseLogResponseCloneable;
};

interface IState {
};

type dealtOrReceivedKey = 'dealt' | 'received';
type rangeKey = 'melee' | 'ranged' | 'afk';

export default class Damage extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  public renderMeleeOrRanged(type: rangeKey): JSX.Element {

    return (
      <div className='row'>
        <div className='col-sm-6'>
          {this.renderDealtOrReceived('dealt', type)}
        </div>
        <div className='col-sm-6'>
          {this.renderDealtOrReceived('received', type)}
        </div>
      </div>
    );
  }

  public renderDealtOrReceived(type: dealtOrReceivedKey, extra?: rangeKey): JSX.Element {
    let thisDamage: ICullingParser.IDamageSummaryDamage = this.props.stats.summary.damage[type];
    if (extra) {
      thisDamage = this.props.stats.summary.damage[extra][type];
    }

    let highestDamage = (<div></div>);
    if (this.props.stats.entries.length > 0) {
      const highestDamageEntry = this.props.stats.entries.reduce(
        (prev, cur) => {
          if (extra &&
            ((extra === 'ranged' && cur.damage.isRanged === false) ||
             (extra === 'melee' && cur.damage.isRanged === true))) {
            return prev;
          }
          return cur.damage[type] > prev.damage[type] ? cur : prev;
        }
      );

      let highestDamageType = '';
      if (highestDamageEntry.damage.isBackstab) {
        if (type === 'dealt') {
          highestDamageType = ` by stabbing him in the back! Excellent strategy.`;
        } else {
          highestDamageType = ` by stabbing you in the back! A most cowardly act.`;
        }
      } else if (highestDamageEntry.damage.isHeadshot) {
        if (type === 'dealt') {
          highestDamageType = ` by blowing his head off. Who cleaned that up?`;
        } else {
          highestDamageType = ` by shooting you in the head. He was proably not even looking. Pure coincidence.`;
        }
      } else if (highestDamageEntry.damage[type] >= 50) {
        if (type === 'dealt') {
          highestDamageType = '! You are the best.';
        } else {
          highestDamageType = '! How did that guy even get a dynamite 1 minute into the game?';
        }
      }

      const toOrFrom = type === 'dealt' ? 'to' : 'from';

      highestDamage = (
        <dd>
          {highestDamageEntry.damage[type]} {toOrFrom} "{
            highestDamageEntry.otherPlayer.substr(0, 9)
          }..."{highestDamageType}
        </dd>
      );
    }
    let avgPerDeahtKillTerm = (<dt>per kill</dt>);
    let avgPerDeahtKillDefinition = (<dd>{(thisDamage.amount / this.props.stats.summary.kills).toFixed(2)}</dd>);
    if (type === 'received') {
      avgPerDeahtKillTerm = (<dt>per death</dt>);
      avgPerDeahtKillDefinition = (<dd>{(thisDamage.amount / this.props.stats.summary.deaths).toFixed(2)}</dd>);
    }

    return (
      <div className='well damage'>
        <h2>Damage {type} {extra}</h2>
        <dl className='dl-horizontal'>
          <dt>Total amount</dt>
          <dd>{thisDamage.amount}</dd>
          <dt>hit count</dt>
          <dd>{thisDamage.count}</dd>
          <dt>Average damage per hit</dt>
          <dd>{(thisDamage.amount / thisDamage.count).toFixed(2)}</dd>
          {avgPerDeahtKillTerm}
          {avgPerDeahtKillDefinition}
          <dt>Highest damage dealt</dt>
          {highestDamage}
        </dl>
      </div>
    );
  }

  public render(): JSX.Element {
    return (
      <div className='damage'>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='well well-sm explanation'>
              <h3>A quick note about damage</h3>
              <p>
                Damage read from the logs is inaccurate, unreliable and sometimes even dubious.
                <br/>
                Bleed damage is not logged, sometimes negative damage values of up to -1 are logged,&nbsp;
                range is given in meters but whether it's actually a ranged weapon is not determinable*, etc...
              </p>
              <p>
                Thus some assumptions are made. Bleed damage is not estimated in any way,&nbsp;
                anything above 3 meters counts as ranged, anything above 300m counts as "afk",&nbsp;
                because it's more likely you weren't actively involved in that damage (traps).
              </p>
              <p>
                <small>
                  * = Well, there is actually a way to tell in some cases:
                  When an attack was blocked for 50% of its damage.
                </small>
              </p>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            {this.renderDealtOrReceived('dealt')}
          </div>
          <div className='col-sm-6'>
            {this.renderDealtOrReceived('received')}
          </div>
        </div>
        {this.renderMeleeOrRanged('melee')}
        {this.renderMeleeOrRanged('ranged')}
      </div>
    );
  }
};
