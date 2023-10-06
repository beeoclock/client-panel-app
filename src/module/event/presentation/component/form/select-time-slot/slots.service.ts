import {inject, Injectable} from "@angular/core";
import {SlotsEventApiAdapter} from "@event/adapter/external/api/slots.event.api.adapter";
import {SECONDS_ONE_HOUR, SECONDS_TEN_MINUTES} from "@utility/domain/const/c.time";
import {NGXLogger} from "ngx-logger";
import {BooleanState} from "@utility/domain";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

@Injectable({
	providedIn: 'root'
})
export class SlotsService {

	private readonly logger = inject(NGXLogger);
	private readonly slotsEventApiAdapter = inject(SlotsEventApiAdapter);
	// private readonly localTemporaryCache = new Map<string, string[]>();
	#slots: string[] = [];

	public readonly loader = new BooleanStreamState(false);
	public readonly initialized = new BooleanState(false);
	#specialist: string | undefined;
	#eventDurationInSeconds = SECONDS_ONE_HOUR;
	#getFreeSlotsDto: {
		specialist: string;
		start: string;
		eventDurationInSeconds: number;
		end: string;
		slotIntervalInSeconds: number
	} | undefined;

	public get slots(): string[] {
		return this.#slots;
	}

	public get specialist(): string | undefined {
		return this.#specialist;
	}

	public get eventDurationInSeconds(): number {
		return this.#eventDurationInSeconds;
	}

	/**
	 *
	 * @param start - ISO string
	 * @param end - ISO string
	 */
	// public async initSlots(start: string, end: string, specialist: string) {
	public async initSlots(
		start: string,
		end: string,
	) {

		if (this.initialized.isOff) {
			this.logger.debug('Initialized: First time init');
			this.initialized.switchOn();
		}

		if (!this.specialist) {
			this.logger.error('Specialist is not defined')
			return;
		}

		this.logger.debug('initSlots', {start, end, specialist: this.specialist, eventDurationInSeconds: this.eventDurationInSeconds})

		// this.inProgress.switchOn();
		//
		// const key = `${start}-${end}`;
		// if (this.localTemporaryCache.has(key)) {
		// 	this.slots.length = 0;
		// 	this.slots.push(...(this.localTemporaryCache.get(key) ?? []));
		// 	return;
		// }

		// let slots: string[] = [];

		try {
			this.#getFreeSlotsDto = {
				start,
				end,
				eventDurationInSeconds: this.eventDurationInSeconds,
				slotIntervalInSeconds: SECONDS_TEN_MINUTES,
				specialist: this.specialist,
			};
			await this.fillSlots();
		} catch (e) {
			this.logger.error(e);
		} finally {
			// this.localTemporaryCache.set(key, slots);
			// this.slots.length = 0;
			// this.slots.push(...slots);
			// this.inProgress.switchOff()
		}

	}

	public async fillSlots() {
		if (!this.#getFreeSlotsDto) {
			this.logger.error('this.#getFreeSlotsDto is not defined');
			return;
		}
		this.#slots = await this.slotsEventApiAdapter.executeAsync(this.#getFreeSlotsDto);
	}

	private async refillSlotsIfInitialized() {
		if (this.initialized.isOn) {
			this.updateGetFreeSlotsDtoWithLocalProperty();
			this.loader.switchOn();
			await this.fillSlots();
			this.loader.switchOff();
		}
	}

	public setSpecialist(specialist: string) {
		this.logger.debug('setSpecialist', {specialist})
		this.#specialist = specialist;
		this.refillSlotsIfInitialized().then();
	}

	public setEventDurationInSeconds(eventDurationInSeconds: number) {
		this.logger.debug('setEventDurationInSeconds', {eventDurationInSeconds})
		this.#eventDurationInSeconds = eventDurationInSeconds;
		this.refillSlotsIfInitialized().then();
	}

	public updateGetFreeSlotsDtoWithLocalProperty() {
		if (this.#getFreeSlotsDto) {
			this.#getFreeSlotsDto.eventDurationInSeconds = this.eventDurationInSeconds;
			if (this.specialist) {
				this.#getFreeSlotsDto.specialist = this.specialist;
			}
		}
	}
}
