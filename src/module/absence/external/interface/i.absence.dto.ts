import {ActiveEnum} from "@utility/domain/enum";
import {AbsenceTypeEnum} from "@module/absence/domain/enums/absence.type.enum";

export interface IAbsenceDto {
	object: 'AbsenceDto';
	_id: string;
	note: string;
	active: ActiveEnum;
	start: string;
	end: string;
	type: AbsenceTypeEnum;
	entireBusiness: boolean;
	memberIds: string[];
	// locations?: LocationDto[]; // TODO
	timeZone: string;
	// meta?: MetaDto;
	createdAt: string;
	updatedAt: string;
}
