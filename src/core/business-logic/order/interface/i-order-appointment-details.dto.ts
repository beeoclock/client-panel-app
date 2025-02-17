import {ActiveEnum, LanguageCodeEnum} from "@core/shared/enum";
import {ISpecialist} from "../../service/interface/i.specialist";
import {ReservationTypeEnum} from "../enum/reservation.type.enum";
import {IBaseEntity} from "@utility/domain";
import {ICustomer} from "../../customer";

export interface IAttachmentDto {
	object: 'AttachmentDto';
	title: string;
	mimeType: string;
	fileUri: string;
	active: number;
}

export interface ILocationsDto {
	object: 'LocationsDto';
	types: string[];
	password: string;
	address: string;
}

export interface IAttendeeDto extends IBaseEntity<'AttendeeDto'> {
	customer: ICustomer.DTO;
	firstTime?: boolean;
}

export interface IOrderAppointmentDetailsDto {
	object: "OrderAppointmentDetailsDto";
	active: ActiveEnum;
	start: string;
	end: string;
	type: ReservationTypeEnum;
	languageCodes: LanguageCodeEnum[];
	// attachments: IAttachmentDto[];
	specialists: ISpecialist[];
	attendees: IAttendeeDto[];
	// locations: ILocationsDto[];
	timeZone: string;
	createdAt: string;
	updatedAt: string;
}
