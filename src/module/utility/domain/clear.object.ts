import {is} from "@src/core/shared/checker";

export function clearObject(target: any) {
	for (const key in target) {
		if (key in target) {
			if (is.object(target[key])) {
				clearObject(target[key]);
				continue;
			}
			if (!target[key] && target[key] !== 0 && target[key] !== false) {
				delete target[key];
			}
		}
	}
}

export function clearObjectClone(target: any): any {
	const clone = structuredClone(target);
	clearObject(clone);
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
