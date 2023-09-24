import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsNewCustomerEnum, IsOptionalEnum, IsOrganizerEnum, ResponseStatusEnum} from "@utility/domain/enum";
import {RIBaseEntity} from "@utility/domain";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

export interface IAttendee extends RIBaseEntity {
	object?: 'Event.Attendant';
	isOptional: IsOptionalEnum;
	isOrganizer: IsOrganizerEnum;
	responseStatus: ResponseStatusEnum;
	isNewCustomer: IsNewCustomerEnum;
	customer: ICustomer;
	active: ActiveEnum;
}

export interface IEvent extends RIBaseEntity {
	object: 'Event';
	servicesAreProvidedInParallel?: boolean;
	services?: IService[];
	description?: string;
	start?: string;
	end?: string;
	timeZone?: string;
	status: EventStatusEnum;

	attendees?: IAttendee[];
}

export type RIEvent = Required<IEvent>;
