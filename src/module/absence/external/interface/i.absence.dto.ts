import {ActiveEnum} from "@utility/domain/enum";
import {AbsenceTypeEnum} from "@module/absence/domain/enums/absence.type.enum";
import {RIMember} from "@member/domain";

export interface IAbsenceDto {
	object: 'AbsenceDto';
	_id: string;
	note: string;
	active: ActiveEnum;
	start: string;
	end: string;
	type: AbsenceTypeEnum;
	entireBusiness: boolean;
	members: RIMember[];
	// locations?: LocationDto[]; // TODO
	timeZone: string;
	// meta?: MetaDto;
	createdAt: string;
	updatedAt: string;
}
