import {inject, Injectable} from "@angular/core";
import {SlotsEventApiAdapter} from "@event/adapter/external/api/slots.event.api.adapter";

@Injectable()
export class SlotsService {
	private readonly slotsEventApiAdapter = inject(SlotsEventApiAdapter);
	constructor() {
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date();
		end.setHours(23, 59, 59, 999);
		this.slotsEventApiAdapter.executeAsync({
			start: start.toISOString(),
			end: end.toISOString(),
			eventDurationMinutes: 60,
			slotIntervalMinutes: 10
		});
	}
}
