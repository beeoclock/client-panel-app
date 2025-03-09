import {InjectionToken} from "@angular/core";
import {BehaviorSubject} from "rxjs";

export const SPECIALIST_LIMIT = new InjectionToken<BehaviorSubject<number | null>>('SPECIALIST_LIMIT');

export const tenantTokens = [
	{
		provide: SPECIALIST_LIMIT,
		useValue: new BehaviorSubject(0)
	}
]
