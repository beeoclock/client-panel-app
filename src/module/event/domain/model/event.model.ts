import {IAttendee, IEvent, RMIEvent} from "@event/domain";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";
import {IService} from "@service/domain";

export class MEvent implements RMIEvent {

	public readonly _id!: string;
	public readonly status!: EventStatusEnum;
	public readonly start!: string;
	public readonly end!: string;
	public readonly createdAt!: string;
	public readonly updatedAt!: string;
	public readonly object!: 'Event';
	public readonly servicesAreProvidedInParallel!: boolean;
	public readonly services!: IService[];
	public readonly description!: string;
	public readonly attendees!: IAttendee[];
	public readonly timeZone!: string;

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

	public static create(initialValue?: Partial<IEvent>): MEvent {
		const target = new MEvent(initialValue);
		return Object.freeze(target);
	}

}
