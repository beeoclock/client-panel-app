import {is} from 'thiis';

export function getFirstKey(value: any): string {
  if (is.object_not_empty(value)) {
    return Object.keys(value)[0];
  }
  return '';
}
