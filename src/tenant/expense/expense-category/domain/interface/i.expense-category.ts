import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";

export namespace IExpenseCategory {

	export interface DTO extends IBaseDTO<'ExpenseCategoryDto'> {
		name: string;
		description: string;
	}

	export type EntityRaw = IBaseEntityRaw<'ExpenseCategoryDto'> & DTO &
		{

			// TODO: add key in base entity to know if entity synced and when it was synced

			// TODO: getOrders
			// TODO: getFavoriteSpecialist
			// TODO: getFavoriteService
			// TODO: getFavoriteProduct
			// TODO: getSpecialistData - when customer is also as specialist

		};

}

export const isExpenseCategory = Tools.createIs<IExpenseCategory.DTO>();
export const validExpenseCategory = Tools.createValidate<IExpenseCategory.DTO>();
export const randomExpenseCategory = Tools.createRandom<IExpenseCategory.DTO>();
