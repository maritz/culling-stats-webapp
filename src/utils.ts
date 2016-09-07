
import { ICullingParser } from 'culling-log-parser';

function sortGenericByDiff(diff: number, order: 'desc' | 'asc') {
  if (order === 'asc') {
    return diff;
  } else {
    return diff * -1;
  }
}

function sortGamesByStart(a: ICullingParser.IGame, b: ICullingParser.IGame, order: 'desc' | 'asc' = 'asc') {
  const diff = a.start.getTime() - b.start.getTime();
  return sortGenericByDiff(diff, order);
}

function fastConcat(array: Array<any>, otherArray: Array<any>) {
  otherArray.forEach((v) => array.push(v));
}

export { fastConcat, sortGamesByStart };
