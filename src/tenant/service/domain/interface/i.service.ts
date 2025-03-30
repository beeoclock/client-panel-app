import {IBaseDTO, IBaseEntityRaw} from "@utility/domain";
import {Tools} from "@core/shared/tools";
import {IPresentation, RIConfiguration, RIDurationVersion, RILanguageVersion, RIPrepaymentPolicy} from "../index";
import {RISchedule} from "@utility/domain/interface/i.schedule";

export namespace IService {

	export interface DTO extends IBaseDTO<'ServiceDto'> {
		configuration: RIConfiguration;
		presentation: IPresentation;
		prepaymentPolicy: RIPrepaymentPolicy;
		languageVersions: RILanguageVersion[];
		durationVersions: RIDurationVersion[];
		schedules: RISchedule[],
		order: number; // Queue/Position in list
	}

	export type EntityRaw = IBaseEntityRaw<'ServiceDto'> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	}

}

export const isService = Tools.createIs<IService.DTO>();
export const validService = Tools.createValidate<IService.DTO>();
export const randomService = Tools.createRandom<IService.DTO>();
