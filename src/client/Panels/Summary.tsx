import * as React from 'react';
import { ICullingParser } from 'culling-log-parser';
import { Link } from 'react-router';

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

    let kdr = (this.props.stats.summary.kills / this.props.stats.summary.deaths).toFixed(2);
    if (this.props.stats.summary.deaths === 0) {
      kdr = 'no deaths! PogChamp';
    }

    // Games come presorted from the worker
    type streakObj = {
      current: number,
      currentRunning: boolean,
      currentStart: Date,
      currentStartIndex: number,
      index: number,
      longest: number,
      start: Date,
    };
    const winStreak: streakObj = {
      current: 0,
      currentRunning: false,
      currentStart: this.props.stats.games[0].start,
      currentStartIndex: 0,
      index: 0,
      longest: 0,
      start: this.props.stats.games[0].start,
    };
    const lossStreak: streakObj = Object.assign({}, winStreak);
    const killStreak: streakObj = Object.assign({}, winStreak);
    const zeroKillStreak: streakObj = Object.assign({}, winStreak);

    const streakCounter = (
      game: ICullingParser.IGame,
      index: number,
      streakObj: streakObj,
      incrementTest: (game: ICullingParser.IGame) => boolean,
    ) => {
      if (incrementTest(game)) {
        if (streakObj.currentRunning === false) {
          streakObj.currentStart = game.start;
          streakObj.currentStartIndex = index;
          streakObj.currentRunning = true;
        }
        streakObj.current++;
        if (streakObj.current > streakObj.longest) {
          streakObj.longest = streakObj.current;
          streakObj.start = streakObj.currentStart;
          streakObj.index = streakObj.currentStartIndex;
        }
      } else {
        streakObj.current = 0;
        streakObj.currentRunning = false;
      }
    };
    let startZeroKillCounter = false;

    this.props.stats.games.forEach(
      (game: ICullingParser.IGame, index: number) => {
        if (!(game.isWin || game.isLoss)) {
          winStreak.current = 0;
          winStreak.currentRunning = false;
          lossStreak.current = 0;
          lossStreak.currentRunning = false;
          return;
        }
        streakCounter(game, index, winStreak, (innerGame) => innerGame.isWin);
        streakCounter(game, index, lossStreak, (innerGame) => innerGame.isLoss);
        if (startZeroKillCounter) {
          streakCounter(game, index, zeroKillStreak, (innerGame) => innerGame.kills === 0);
        }

        if (game.kills > 0) {
          startZeroKillCounter = true;
          if (killStreak.currentRunning === false) {
            killStreak.currentStart = game.start;
            killStreak.currentStartIndex = index;
            killStreak.currentRunning = true;
          }
          killStreak.current += game.kills;
          if (killStreak.current > killStreak.longest) {
            killStreak.longest = killStreak.current;
            killStreak.start = game.start;
            killStreak.index = killStreak.currentStartIndex;
          }
        }
        if (game.isLoss) {
          killStreak.current = 0;
          killStreak.currentRunning = false;
        }
      }
    );

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
              <dd>{kdr}</dd>
              <dt>Backstabs</dt>
              <dd>{this.props.stats.summary.damage.dealt.backstabCount}</dd>
              <dt>Headshots</dt>
              <dd>{this.props.stats.summary.damage.dealt.headshotCount}</dd>
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
              <dt>Melee attacks blocked</dt>
              <dd>{percentMeleeBlocked.toFixed(1)} %</dd>
              <dt>Blocks melee attacked <br/><small>(you got stunned)</small></dt>
              <dd>{percentMeleeBlocksHit.toFixed(1)} %</dd>
              <dt>Range attacks blocked <br/><small>(reduces 50% damage)</small></dt>
              <dd>{this.props.stats.summary.damage.received.rangeBlockCount}</dd>
            </dl>
          </div>
        </div>
        <div className='col-sm-12 col-md-4'>
          <div className='well'>
            <h2>Streaks</h2>
            <dl className=''>
              <dt>Longest Win Streak</dt>
              <dd>
                {winStreak.longest}&nbsp;
                <small>
                  <Link to={`games/${winStreak.index}`}>
                    ({winStreak.start.toLocaleString()})
                  </Link>
                </small>
              </dd>
              <dt>
                Longest Losing Streak
              </dt>
              <dd>
                {lossStreak.longest}&nbsp;
                <small>
                  <Link to={`games/${lossStreak.index}`}>
                    ({lossStreak.start.toLocaleString()})
                  </Link>
                </small>
              </dd>
              <dt>
                Longest Kill Streak
                <br/>
              </dt>
              <dd>{killStreak.longest}&nbsp;
                <small>
                  <Link to={`games/${killStreak.index}`}>
                    ({killStreak.start.toLocaleString()})
                  </Link>
                </small>
              </dd>
              <dt>Most games in a row without a single kill</dt>
              <dd>{zeroKillStreak.longest}&nbsp;
                <small>
                  <Link to={`games/${zeroKillStreak.index}`}>
                    ({zeroKillStreak.start.toLocaleString()})
                  </Link>
                </small>
              </dd>
            </dl>
            <p>
              Games that do not have rankscoring win/loss do not count and stop streaks!
            </p>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="well">
            <p>
              Keep in mind that wins, losses, kills and deaths can only be counted when they are logged as such.
              <br />Wins and losses were added towards the end of April, but appear to be spotty/unreliable for a while.
              <br/>At some point in June a patch was released that fixed this and at that point these stats become a lot more accurate. (nearly 100% for me)
              <br />If you go to the Games section, you can look through your games and see exactly where it started to get reliable with these stats.
            </p>
          </div>
        </div>
      </div>
    );
  }
};
