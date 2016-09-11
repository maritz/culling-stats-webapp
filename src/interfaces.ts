import { DamageSummary, ICullingParser } from 'culling-log-parser';

export interface ICompiledStatsSummary {
  end: Date;
  highestDamageEntry: ICullingParser.ILogEntry;
  games: Array<ICullingParser.IGame>,
  meta: {
    lines: {
      total: number;
      relevant: number;
    };
    errors: Array<string | Error>;
    warnings: Array<string>;
    version: number;
  };
  players: {
    [name: string]: ICullingParser.IPlayerDataRaw;
  };
  start: Date;
  summary: {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    damage: DamageSummary;
  };
}
