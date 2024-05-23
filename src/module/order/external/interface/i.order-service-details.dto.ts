import {LanguageCodeEnum} from "@utility/domain/enum";
import {IAttendee} from "@event/domain";
import {ISpecialist} from "@service/domain/interface/i.specialist";

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

export interface IOrderServiceDetailsDto {
	object: "OrderServiceDetailsDto";
	active: number;
	start: string;
	end: string;
	type: string;
	languageCodes: LanguageCodeEnum[];
	attachments: IAttachmentDto[];
	specialists: ISpecialist[];
	attendees: IAttendee[];
	locations: ILocationsDto[];
	timeZone: string;
	createdAt: string;
	updatedAt: string;
}
