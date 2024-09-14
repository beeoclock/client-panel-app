import {is} from "@utility/checker";

export function getFirstKey(value: unknown): string {
	if (is.object_not_empty<NonNullable<unknown>>(value)) {
		return Object.keys(value)[0];
	}
	return '';
}
