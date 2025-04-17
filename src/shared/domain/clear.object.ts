import {is} from "@core/shared/checker";

/**
 *
 * @param target
 * @param expectedNegativeValue
 */
export function clearObject(target: any, expectedNegativeValue: any[] = [0, false]) {
	for (const key in target) {
		if (is.object(target[key])) {
			clearObject(target[key]);
			continue;
		}
		if ((!target[key] || target[key]?.length === 0) && !expectedNegativeValue.includes(target[key])) {
			delete target[key];
		}
	}
}

export function clearObjectClone<T>(target: any, expectedNegativeValue: any[] = [0, false]): T {
	const clone = structuredClone(target);
	clearObject(clone, expectedNegativeValue);
	return clone;
}

export function clearObjectExcept(target: any, ...keys: string[]) {
	for (const key in target) {
		if (key in target) {
			if (keys.includes(key)) {
				continue;
			}
			if (is.object(target[key])) {
				clearObjectExcept(target[key], ...keys);
				continue;
			}
			if (!target[key] && target[key] !== 0 && target[key] !== false) {
				delete target[key];
			}
		}
	}
}
