import {Injectable, signal, Type} from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class SecondRouterOutletService {

	public readonly activated = signal<Type<unknown> | null>(null);

}
