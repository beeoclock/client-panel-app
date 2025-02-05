import {IAttendee, IEvent, IEventConfiguration, RMIEvent} from "@event/domain";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";
import {ActiveEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {IServiceDto} from "@order/domain/interface/i.service.dto";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {StateEnum} from "@utility/domain/enum/state.enum";
import {Types} from "@src/module/utility/types";

export class MEvent implements RMIEvent {

	public readonly _id!: string;
	public readonly status!: EventStatusEnum;
	public readonly start!: string;
	public readonly end!: string;
	public readonly createdAt!: string;
	public readonly updatedAt!: string;
	public readonly object!: 'Event';
	public readonly servicesAreProvidedInParallel!: boolean;
	public readonly services!: IServiceDto[];
	public readonly note!: string;
	public readonly language!: LanguageCodeEnum;
	public readonly attendees!: IAttendee[];
	public readonly timeZone!: string;
	public readonly configuration!: IEventConfiguration;
	public readonly specialists!: ISpecialist[];
	public readonly state!: StateEnum;
	public readonly active!: ActiveEnum;
	public readonly stateHistory!: { state: StateEnum; setAt: string & Types.DateTime; }[];

	constructor(initialValue?: Partial<IEvent>) {
		if (initialValue) {
			Object.assign(this, initialValue);
		}
	}

	public get isRequested(): boolean {
		return this.status === EventStatusEnum.requested;
	}

	public get isBooked(): boolean {
		return this.status === EventStatusEnum.booked;
	}

	public get isDone(): boolean {
		return this.status === EventStatusEnum.done;
	}

	public get isCancelled(): boolean {
		return this.status === EventStatusEnum.cancelled;
	}

	public get someServiceHasRangeDurationVersion(): boolean {
		return this.services.some((service) => (service?.configuration?.duration?.durationVersionType ?? DurationVersionTypeEnum.VARIABLE) === DurationVersionTypeEnum.RANGE);
	}

	public static create(initialValue?: Partial<IEvent>): MEvent {
		const target = new MEvent(initialValue);
		return Object.freeze(target);
	}

}
