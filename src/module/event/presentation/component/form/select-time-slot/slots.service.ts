import {inject, Injectable} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/time/select-time.component";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {DateTime} from "luxon";
import {SlotBuildingStrategyEnum} from "@client/domain/enum/slot-building-strategy.enum";
import {BehaviorSubject} from "rxjs";
import {IDayItem} from "@utility/domain/interface/i.day-item";
import {IBusySlot} from "@src/core/business-logic/order/interface/busy-slot/i.busy-slot";


@Injectable()
export class SlotsService {

	public readonly slots: string[] = [];
	// private readonly busySlotsEventApiAdapter = inject(BusySlotsEventApiAdapter);
	public readonly initialized = new BooleanStreamState(false);
	public readonly loader = new BooleanStreamState(false);
	public dayItemList$: BehaviorSubject<IDayItem[]> = new BehaviorSubject<IDayItem[]>([]);
	public firstSlot$ = new BehaviorSubject<{ start: DateTime; end: DateTime } | null>(null);
	public selectTimeComponent: SelectTimeComponent | undefined;
	private readonly logger = inject(NGXLogger);
	private firstDayIso!: string;
	private lastDayIso!: string;
	private busySlots: IBusySlot[] = [];
	private schedules: RISchedule[] = [];
	private specialist: string | undefined;
	private eventDurationInSeconds = 0;
	private slotBuildingStrategy: SlotBuildingStrategyEnum = SlotBuildingStrategyEnum.ByService;
	private slotIntervalInSeconds = 0;

	public get dayItemList(): IDayItem[] {
		return this.dayItemList$.getValue();
	}

	public get specialistExist(): boolean {
		return Boolean(this.specialist);
	}

	public getSlotsByDay(day: DateTime) {
		const dayItem = this.dayItemList.find((dayItem) => {
			return dayItem.datetime.hasSame(day, 'day');
		});
		return dayItem?.slots ?? [];
	}

	public async initSlots() {

		this.loader.doTrue();

		try {

			// #1 Load busy slots
			await this.loadBusySlots(this.firstDayIso, this.lastDayIso);

			// #2 Calculate all free schedules pieces based on busy slots
			this.calculateFreeSchedulePiecesPerDay();

			if (this.initialized.isFalse) {

				this.logger.debug('Initialized: First time initialize, after service has been selected');

				// #3 Set first slot
				const firstSlot = this.getFirstSlot();
				this.firstSlot$.next(firstSlot);

				this.initialized.doTrue();

			}

		} catch (e) {

			this.logger.error(e);

		} finally {

			setTimeout(() => {
				this.loader.doFalse();
			}, 250);

		}

		return this;

	}

	public setSchedules(schedules: RISchedule[]) {

		this.logger.debug('setSchedules', {schedules})
		this.schedules = schedules;
		return this;

	}

	public setSpecialist(specialist: string) {

		this.logger.debug('setSpecialist', {specialist});
		this.specialist = specialist;
		return this;

	}

	public setEventDurationInSeconds(eventDurationInSeconds: number) {

		this.logger.debug('setEventDurationInSeconds', {eventDurationInSeconds})
		this.eventDurationInSeconds = eventDurationInSeconds;
		return this;

	}

	public setBusySlots(busySlots: IBusySlot[]) {

		this.logger.debug('setBusySlots', {busySlots})
		this.busySlots = busySlots;
		return this;

	}

	public setFirstAndLastDayIso(firstDayIso: string, lastDayIso: string) {

		this.logger.debug('setFirstAndLastDayIso', {firstDayIso, lastDayIso})
		this.firstDayIso = firstDayIso;
		this.lastDayIso = lastDayIso;
		return this;

	}

	public setSlotBuildingStrategy(slotBuildingStrategy: SlotBuildingStrategyEnum) {

		this.logger.debug('slotBuildingStrategy', {slotBuildingStrategy})
		this.slotBuildingStrategy = slotBuildingStrategy;
		return this;

	}

	public setSlotIntervalInSeconds(slotIntervalInSeconds: number) {

		this.logger.debug('setSlotIntervalInSeconds', {slotIntervalInSeconds})
		this.slotIntervalInSeconds = slotIntervalInSeconds;
		return this;

	}

	public setDayItemList(dayItemList: IDayItem[]) {

		this.logger.debug('setDayItemList', {dayItemList})
		this.dayItemList$.next(dayItemList);


		const [firstDayItem] = this.dayItemList;
		const firstDayIso = firstDayItem.datetime.toUTC().toISO();
		const lastDayItem = this.dayItemList.at(-1);
		const lastDayIso = lastDayItem?.datetime.toUTC().toISO();

		if (firstDayIso && lastDayIso) {
			this.setFirstAndLastDayIso(firstDayIso, lastDayIso);
		}

		return this;

	}

	private getFirstSlot() {
		for (const dayItem of this.dayItemList) {
			const slot = dayItem.slots[0];
			if (slot) {
				return slot;
			}
		}
		return null;
	}

	private async loadBusySlots(start: string, end: string) {

		end = DateTime.fromISO(end).endOf('day').toJSDate().toISOString();

		const params = {
			start,
			end,
			specialist: this.specialist,
		};

		this.logger.debug('loadBusySlots', {params});

		// return this.busySlotsEventApiAdapter.executeAsync(params).then(this.setBusySlots.bind(this));
	}

	private calculateFreeSchedulePiecesPerDay() {

		this.logger.debug('calculateFreeSchedulePiecesPerDay', {
			schedules: this.schedules,
			busySlots: this.busySlots,
			dayItemList: this.dayItemList,
		});

		// #0 Check if schedules are defined
		if (!this.schedules.length) {
			this.logger.debug('calculateFreeSchedulePiecesPerDay: schedules is empty');
			return;
		}

		const busySlotsInDateTime = this.busySlots.map((busySlot) => {
			return {
				start: DateTime.fromISO(busySlot.start),
				end: DateTime.fromISO(busySlot.end),
			};
		});

		const today = DateTime.now();

		this.dayItemList.forEach((dayItem) => {

			this.logger.debug('calculateFreeSchedulePiecesPerDay: dayItem', dayItem.datetime.toISO(), dayItem);

			// #1 Find schedules for current day
			let schedules = this.schedules
				// #1.0 Filter schedules by work days
				.filter((schedule) => {
					return schedule.workDays?.includes(dayItem.datetime.weekday) ?? false;
				})
				// #1.1 Filter schedules by event duration, schedule gaps should be more than event duration
				.filter(({endInSeconds, startInSeconds}) => {
					const scheduleDuration = endInSeconds - startInSeconds;
					return scheduleDuration >= this.eventDurationInSeconds;
				})
				// #1.2 Sort schedules by start time
				.sort((a, b) => {
					return a.startInSeconds - b.startInSeconds;
				})
				// #1.3 Convert seconds to datetime
				.map(({endInSeconds, startInSeconds}) => ({
					start: dayItem.datetime.startOf('day').plus({second: startInSeconds}),
					end: dayItem.datetime.startOf('day').plus({second: endInSeconds}),
				}));

			if (!schedules.length) {
				return;
			}

			this.logger.debug('calculateFreeSchedulePiecesPerDay: schedules', schedules);

			const indexesOfBusySlotsWhichCoverSchedule: number[] = [];

			// #2 Find busy slots for current day
			const busySlotsInSchedules = busySlotsInDateTime.filter((busySlot) => {
				const startHasSameDay = dayItem.datetime.hasSame(busySlot.start, 'day');
				const endHasSameDay = dayItem.datetime.hasSame(busySlot.end, 'day');
				if (!startHasSameDay && !endHasSameDay) {
					return;
				}
				const busySlotIsInSchedule = schedules.some((schedule, index) => {
					const inside = busySlot.start >= schedule.start && busySlot.end <= schedule.end;
					if (inside) {
						return true;
					}
					const outside = busySlot.start <= schedule.start && busySlot.end >= schedule.end;
					if (outside) {
						indexesOfBusySlotsWhichCoverSchedule.push(index);
						return true;
					}
					const startIsInSchedule = busySlot.start >= schedule.start && busySlot.start <= schedule.end;
					if (startIsInSchedule) {
						return true;
					}
					const endIsInSchedule = busySlot.end >= schedule.start && busySlot.end <= schedule.end;
					return endIsInSchedule;
				});
				return busySlotIsInSchedule;
			});

			// #3 Check if there are busy slots which cover schedule
			if (indexesOfBusySlotsWhichCoverSchedule.length) {
				this.logger.debug('Found busy slots which cover schedule', indexesOfBusySlotsWhichCoverSchedule);
				// Remove schedules which are covered by busy slots
				schedules = schedules.filter((schedule, index) => {
					return !indexesOfBusySlotsWhichCoverSchedule.includes(index);
				});
			}

			// #4 Clear slots
			dayItem.slots.length = 0;

			// #5 Find schedule pieces for current day
			schedules.forEach((schedule, index) => {

				this.logger.debug(`\n\n SCHEDULE: #${index} \n\n`);

				let loopStart = schedule.start;
				const finish = schedule.end;

				// 5.1 Check if loopStart is in the past
				if (loopStart < today) {

					const minutes = today.minute;
					let intervalInMinutes = 0;

					switch (this.slotBuildingStrategy) {
						case SlotBuildingStrategyEnum.ByService:
							intervalInMinutes = this.eventDurationInSeconds / 60;
							break;
						case SlotBuildingStrategyEnum.ByInterval:
							intervalInMinutes = this.slotIntervalInSeconds / 60;
							break;
					}

					intervalInMinutes = (+Math.floor((minutes / intervalInMinutes)).toFixed(0) + 1) * intervalInMinutes;

					loopStart = today.startOf('minute').set({
						minute: intervalInMinutes,
					});

				}

				this.logger.debug('calculateFreeSchedulePiecesPerDay: loopStart, finish', loopStart, finish);

				while (loopStart < finish) {

					const loopEnd = loopStart.plus({second: this.eventDurationInSeconds});

					this.logger.debug('calculateFreeSchedulePiecesPerDay: loopStart, loopEnd', loopStart, loopEnd);

					const busySlot = busySlotsInSchedules.find((busySlot) => {
						const inside = loopStart >= busySlot.start && loopEnd <= busySlot.end;
						if (inside) {
							return true;
						}
						const startIsInSchedule = loopStart >= busySlot.start && loopStart < busySlot.end;
						if (startIsInSchedule) {
							return true;
						}
						const endIsInSchedule = loopEnd > busySlot.start && loopEnd <= busySlot.end;
						return endIsInSchedule
					});

					this.logger.debug('calculateFreeSchedulePiecesPerDay: busySlot', busySlot);

					if (busySlot) {
						// Round loopStart to busySlot.end
						loopStart = busySlot.end;
						continue;
					} else {
						// If loopEnd is more than finish, then set loopStart to finish
						if (loopEnd > finish) {
							loopStart = finish;
							continue;
						}
						dayItem.slots.push({
							start: loopStart,
							end: loopEnd,
						});
					}

					switch (this.slotBuildingStrategy) {
						case SlotBuildingStrategyEnum.ByService:
							loopStart = loopStart.plus({second: this.eventDurationInSeconds});
							break;
						case SlotBuildingStrategyEnum.ByInterval:
							loopStart = loopStart.plus({second: this.slotIntervalInSeconds});
							break;
						default:
							throw new Error(`Unknown slot building strategy: ${this.slotBuildingStrategy}`);
					}

				}

			});

		});

		this.logger.debug('calculateFreeSchedulePiecesPerDay: dayItemList', this.dayItemList);

	}
}
