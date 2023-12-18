import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsNewCustomerEnum, IsOptionalEnum, IsOrganizerEnum, ResponseStatusEnum} from "@utility/domain/enum";
import {RIBaseEntity} from "@utility/domain";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

export interface IEventConfiguration {
	ignoreEventChecks: boolean; // Ignore checking if slot is busy
}

export interface IAttendee extends RIBaseEntity<'Event.Attendant'> {
	isOptional: IsOptionalEnum;
	isOrganizer: IsOrganizerEnum;
	responseStatus: ResponseStatusEnum;
	isNewCustomer: IsNewCustomerEnum;
	customer: ICustomer;
	active: ActiveEnum;
}

export interface IEvent extends RIBaseEntity<'Event'> {
	servicesAreProvidedInParallel?: boolean;
	services?: IService[];
	description?: string;
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
