import {ICustomer} from "@tenant/customer/domain";
import {IsOptionalEnum, IsOrganizerEnum, LanguageCodeEnum, ResponseStatusEnum} from "@core/shared/enum";
import {IBaseDTO} from "@utility/domain";
import {EventStatusEnum} from "@core/shared/enum/event-status.enum";
import {ISpecialist} from "@tenant/service/domain/interface/i.specialist";
import {IService} from "@tenant/service/domain/interface/i.service";

export interface IEventConfiguration {
	ignoreEventChecks: boolean; // Ignore checking if slot is busy
}

export interface IAttendee extends IBaseDTO<'Event.Attendant'> {
	isOptional: IsOptionalEnum;
	isOrganizer: IsOrganizerEnum;
	responseStatus: ResponseStatusEnum;
	customer: ICustomer.DTO;
}

export interface IEvent extends IBaseDTO<'Event'> {
	servicesAreProvidedInParallel?: boolean;
	services?: IService.DTO[];
	specialists?: ISpecialist[];
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
