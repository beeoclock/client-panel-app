import {ActiveEnum} from "@utility/domain/enum";
import {AbsenceTypeEnum} from "@module/absence/domain/enums/absence.type.enum";
import {RIMember} from "@member/domain";
import {Tools} from "@utility/tools";

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

export const isAbsence = Tools.createIs<IAbsenceDto>();
export const validAbsence = Tools.createValidate<IAbsenceDto>();
export const randomAbsence = Tools.createRandom<IAbsenceDto>();
