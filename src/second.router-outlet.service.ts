import {Injectable, signal} from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class SecondRouterOutletService {

	public readonly activated = signal<object | null>(null);
	public readonly deactivated = signal<object | null>(null);

}
