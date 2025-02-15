import {AbsenceTypeEnum} from "../enums/absence.type.enum";
import {RIMember} from "../../member";
import {IBaseEntity} from "@utility/domain";
import IBaseItem from "@core/shared/interface/i.base-item";
import {Tools} from "@core/shared/tools";


export namespace IAbsence {

	export interface DTO extends IBaseEntity<'AbsenceDto'> {
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

	export interface Entity extends IBaseItem<'AbsenceDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	}

}

export const isAbsence = Tools.createIs<IAbsence.DTO>();
export const validAbsence = Tools.createValidate<IAbsence.DTO>();
export const randomAbsence = Tools.createRandom<IAbsence.DTO>();
