import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";

export namespace IBalance {

	export interface DTO extends IBaseDTO<'BalanceDto'> {

	}

	export type EntityRaw = IBaseEntityRaw<'BalanceDto'> & DTO &
		{

			// TODO: add key in base entity to know if entity synced and when it was synced

			// TODO: getOrders
			// TODO: getFavoriteSpecialist
			// TODO: getFavoriteService
			// TODO: getFavoriteProduct
			// TODO: getSpecialistData - when customer is also as specialist

		};

}

export const isBalance = Tools.createIs<IBalance.DTO>();
export const validBalance = Tools.createValidate<IBalance.DTO>();
export const randomBalance = Tools.createRandom<IBalance.DTO>();
