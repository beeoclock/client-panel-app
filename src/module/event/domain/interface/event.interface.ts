import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsOptionalEnum, IsOrganizerEnum, LanguageCodeEnum, ResponseStatusEnum} from "@utility/domain/enum";
import {RIBaseEntity} from "@utility/domain";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

export interface IEventConfiguration {
	ignoreEventChecks: boolean; // Ignore checking if slot is busy
}

export interface IAttendee extends RIBaseEntity<'Event.Attendant'> {
	isOptional: IsOptionalEnum;
	isOrganizer: IsOrganizerEnum;
	responseStatus: ResponseStatusEnum;
	customer: ICustomer;
	active: ActiveEnum;
}

export interface IEvent extends RIBaseEntity<'Event'> {
	servicesAreProvidedInParallel?: boolean;
	services?: IService[];
	language?: LanguageCodeEnum;
	note?: string;
	start?: string;
	end?: string;
	timeZone?: string;
	status: EventStatusEnum;
	configuration?: IEventConfiguration;

	attendees?: IAttendee[];
}

export type RIEvent = Required<IEvent>;

export interface MIEvent extends IEvent {
	isRequested?: boolean;
	isBooked?: boolean;
	isDone?: boolean;
	isCancelled?: boolean;
}

export type RMIEvent = Required<MIEvent>;


export interface IAttendee_V2<ORIGINAL_DATA = unknown> {
	isOrganizer: IsOrganizerEnum;
	_id: string;
	is: 'specialist' | 'customer';
	originalData: ORIGINAL_DATA;
}

export interface IEvent_V2<ORIGINAL_DATA = unknown> {
	_id: string;
	start: string;
	end: string;
	note: string;
	entireBusiness: boolean;
	attendees: IAttendee_V2[];
	is: 'order' | 'absence';
	originalData: ORIGINAL_DATA;
	createdAt: string;
	updatedAt: string;
}
