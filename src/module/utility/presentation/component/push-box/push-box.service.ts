import {Injectable, Type} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class PushBoxService {

	public readonly observe$ = new Subject<{
		component: Type<unknown>;
		inputs?: Record<string, unknown>;
		title?: string;
	}>();
	public readonly destroy$ = new Subject<Type<unknown>>();

}
