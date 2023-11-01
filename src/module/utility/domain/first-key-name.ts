import {is} from 'thiis';

export function getFirstKey(value: unknown): string {
	if (is.object_not_empty<Object>(value)) {
		return Object.keys(value)[0];
	}
	return '';
}
