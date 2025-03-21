import {InjectionToken} from "@angular/core";
import {BehaviorSubject} from "rxjs";

export const SPECIALIST_LIMIT = new InjectionToken<BehaviorSubject<number | null>>('SPECIALIST_LIMIT', {
	factory: () => new BehaviorSubject<number | null>(0)
});

export const tenantTokens = [
	SPECIALIST_LIMIT
]
