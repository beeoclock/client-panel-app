import {ActiveEnum} from "@utility/domain/enum";
import {IAttendee} from "@event/domain";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";

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

export interface IOrderAppointmentDetailsDto {
    object: "OrderAppointmentDetailsDto";
    active: ActiveEnum;
    start: string;
    end: string;
    type: ReservationTypeEnum;
    // languageCodes: LanguageCodeEnum[]; // TODO Add type
    // attachments: IAttachmentDto[]; // TODO Add type
    specialists: ISpecialist[];
    attendees: IAttendee[];
    // locations: ILocationsDto[]; // TODO Add type
    timeZone: string;
    createdAt: string;
    updatedAt: string;
}
