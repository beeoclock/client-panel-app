import {IBaseEntity} from "@utility/domain";
import IBaseItem from "../../../system/interface/i.base-item";
import {Tools} from "../../../shared/tools";
import {IPresentation, RIConfiguration, RIDurationVersion, RILanguageVersion, RIPrepaymentPolicy} from "../index";
import {RISchedule} from "@utility/domain/interface/i.schedule";

export namespace IService {

	export interface DTO extends IBaseEntity<'ServiceDto'> {
		configuration: RIConfiguration;
		presentation: IPresentation;
		prepaymentPolicy: RIPrepaymentPolicy;
		languageVersions: RILanguageVersion[];
		durationVersions: RIDurationVersion[];
		schedules: RISchedule[],
		order: number; // Queue/Position in list
	}

	export interface Entity extends IBaseItem<'ServiceDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	}

}

export const isService = Tools.createIs<IService.DTO>();
export const validService = Tools.createValidate<IService.DTO>();
export const randomService = Tools.createRandom<IService.DTO>();
