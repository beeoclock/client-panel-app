import {AbsenceTypeEnum} from "../enums/absence.type.enum";
import {IBaseDTO, IBaseEntity} from "@utility/domain";
import {Tools} from "@core/shared/tools";
import {IMember} from "@core/business-logic/member/interface/i.member";


export namespace IAbsence {

	export interface DTO extends IBaseDTO<'AbsenceDto'> {
		note: string;
		start: string;
		end: string;
		type: AbsenceTypeEnum;
		entireBusiness: boolean;
		members: IMember.DTO[];
		// locations?: LocationDto[]; // TODO
		timeZone: string;
		// meta?: MetaDto;
	}

	export type Entity = IBaseEntity<'AbsenceDto', DTO> & DTO;

}

export const isAbsence = Tools.createIs<IAbsence.DTO>();
export const validAbsence = Tools.createValidate<IAbsence.DTO>();
export const randomAbsence = Tools.createRandom<IAbsence.DTO>();
