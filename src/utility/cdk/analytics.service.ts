import {inject, Injectable} from "@angular/core";
import {Analytics, logEvent} from "@angular/fire/analytics";

@Injectable({
	providedIn: 'root'
})
export class AnalyticsService {

	readonly #analytics = inject(Analytics);

	public logEvent(eventName: string, eventParams?: Record<string, unknown>): void {

		logEvent(this.#analytics, eventName, eventParams);

	}

}
