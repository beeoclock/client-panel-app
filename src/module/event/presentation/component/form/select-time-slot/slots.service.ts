import {inject, Injectable} from "@angular/core";
import {SlotsEventApiAdapter} from "@event/adapter/external/api/slots.event.api.adapter";
import {NGXLogger} from "ngx-logger";
import {BooleanState} from "@utility/domain";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/time/select-time.component";
import hash_sum from "hash-sum";
import {HALF_HOUR_IN_SECONDS, ONE_HOUR_IN_SECONDS} from "@utility/domain/time";
import {ListEventApiAdapter} from "@event/adapter/external/api/list.event.api.adapter";

@Injectable({
	providedIn: 'root'
})
export class SlotsService {

	private readonly logger = inject(NGXLogger);
	private readonly listEventApiAdapter = inject(ListEventApiAdapter);
	private readonly slotsEventApiAdapter = inject(SlotsEventApiAdapter);
	private readonly localTemporaryCache = new Map<string, string[]>();
	#slots: string[] = [];

	public readonly loader = new BooleanStreamState(false);
	public readonly initialized = new BooleanState(false);
	#specialist: string | undefined;
	#eventDurationInSeconds = ONE_HOUR_IN_SECONDS;
	#getFreeSlotsDto: {
		specialist: string;
		start: string;
		eventDurationInSeconds: number;
		end: string;
		slotIntervalInSeconds: number
	} | undefined;

	public selectTimeComponent: SelectTimeComponent | undefined;

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
			this.logger.debug('Initialized: First time initialize');
			this.initialized.switchOn();
		}

		if (!this.specialist) {
			this.logger.error('Specialist is not defined')
			return;
		}

		this.logger.debug('initSlots', {start, end, specialist: this.specialist, eventDurationInSeconds: this.eventDurationInSeconds})

		this.#getFreeSlotsDto = {
			start,
			end,
			eventDurationInSeconds: this.eventDurationInSeconds,
			slotIntervalInSeconds: HALF_HOUR_IN_SECONDS,
			specialist: this.specialist,
		};

		this.listEventApiAdapter.executeAsync({
			start,
			end,
			orderBy: 'start',
			orderDir: 'asc',
		}).then((result) => {
			console.log(result);
		});

		const key = hash_sum(this.#getFreeSlotsDto);
		this.logger.debug('initSlots.key:', {key})

		try {
			if (this.localTemporaryCache.has(key)) {
				this.#slots = (this.localTemporaryCache.get(key) ?? []);
				return;
			}

			await this.fillSlots();
		} catch (e) {
			this.logger.error(e);
		} finally {
			this.localTemporaryCache.set(key, this.#slots);
		}

		return this;

	}

	public async fillSlots() {
		if (!this.#getFreeSlotsDto) {
			this.logger.error('this.#getFreeSlotsDto is not defined');
			return;
		}
		this.#slots = await this.slotsEventApiAdapter.executeAsync(this.#getFreeSlotsDto);
		this.selectTimeComponent?.initTimeSlotLists();
		return this;
	}

	public async refillSlotsIfInitialized() {
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
		return this;
	}

	public setEventDurationInSeconds(eventDurationInSeconds: number) {
		this.logger.debug('setEventDurationInSeconds', {eventDurationInSeconds})
		this.#eventDurationInSeconds = eventDurationInSeconds;
		return this;
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
