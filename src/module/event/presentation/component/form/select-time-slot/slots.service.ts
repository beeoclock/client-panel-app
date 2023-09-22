import {inject, Injectable} from "@angular/core";
import {SlotsEventApiAdapter} from "@event/adapter/external/api/slots.event.api.adapter";

@Injectable()
export class SlotsService {

	private readonly slotsEventApiAdapter = inject(SlotsEventApiAdapter);
	private readonly localTemporaryCache = new Map<string, string[]>();
	private readonly slots: string[] = [];

	public getSlots(): string[] {

		return structuredClone(this.slots);

	}

	/**
	 *
	 * @param start - ISO string
	 * @param end - ISO string
	 */
	public async initSlots(start: string, end: string) {

		const key = `${start}-${end}`;
		if (this.localTemporaryCache.has(key)) {
			this.slots.length = 0;
			this.slots.push(...(this.localTemporaryCache.get(key) ?? []));
			return;
		}

		const slots = await this.slotsEventApiAdapter.executeAsync({
			start,
			end,
			eventDurationSeconds: 60,
			slotIntervalSeconds: 10
		});

		this.localTemporaryCache.set(key, slots);
		this.slots.length = 0;
		this.slots.push(...slots);

	}

}
