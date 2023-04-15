import {is} from 'thiis';

export function getFirstKey(value: any): string {
  if (is.object.not.null.or.empty(value)) {
    return Object.keys(value)[0];
  }
  return '';
}
