import {AbsenceTypeEnum} from "@module/absence/domain/enums/absence.type.enum";
import {RIMember} from "@member/domain";
import {IBaseEntity} from "@utility/domain";

export interface IAbsenceDto extends IBaseEntity<'AbsenceDto'> {
	note: string;
	start: string;
	end: string;
	type: AbsenceTypeEnum;
	entireBusiness: boolean;
	members: RIMember[];
	// locations?: LocationDto[]; // TODO
	timeZone: string;
	// meta?: MetaDto;
}
