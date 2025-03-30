import {IAttendee, IEvent, IEventConfiguration, RMIEvent} from "@tenant/event/domain";
import {EventStatusEnum} from "@core/shared/enum/event-status.enum";
import {DurationVersionTypeEnum} from "@core/business-logic/service/enum/duration-version-type.enum";
import {LanguageCodeEnum} from "@core/shared/enum";
import {ISpecialist} from "@core/business-logic/service/interface/i.specialist";
import {StateEnum} from "@core/shared/enum/state.enum";
import {Types} from "@core/shared/types";
import {IService} from "@core/business-logic/service/interface/i.service";

export class MEvent implements RMIEvent {

	public readonly _id!: string;
	public readonly status!: EventStatusEnum;
	public readonly start!: string;
	public readonly end!: string;
	public readonly createdAt!: string;
	public readonly updatedAt!: string;
	public readonly object!: 'Event';
	public readonly servicesAreProvidedInParallel!: boolean;
	public readonly services!: IService.DTO[];
	public readonly note!: string;
	public readonly language!: LanguageCodeEnum;
	public readonly attendees!: IAttendee[];
	public readonly timeZone!: string;
	public readonly configuration!: IEventConfiguration;
	public readonly specialists!: ISpecialist[];
	public readonly state!: StateEnum;
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
