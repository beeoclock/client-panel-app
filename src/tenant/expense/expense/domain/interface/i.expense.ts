import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {CurrencyCodeEnum} from "@core/shared/enum";

export namespace IExpense {

	export interface IValue {
		object: "ExpenseValueDto",
		amount: number;
		currency: CurrencyCodeEnum;
	}

	export interface ISource {
		object: "ExpenseSourceDto",
		name: string;
		sourceId: string; // TODO: Change onto anchorId
		sourceType: string; // TODO: change onto anchor
	}

	export interface ICategory extends IBaseDTO<'ExpenseCategoryDto'> {
		name: string;
		description: string;
	}

	export interface ILineItem {
		object: "ExpenseLineItemDTO",
		categories: ICategory[],
		itemValue: IValue;
		description: string;
		source: ISource;
	}

	export interface DTO extends IBaseDTO<'ExpenseDto'> {
		totalValue: IValue;
		expensedAt: string;
		description: string;
		items: ILineItem[];
	}

	export type EntityRaw = IBaseEntityRaw<'ExpenseDto'> & DTO &
		{

			// TODO: add key in base entity to know if entity synced and when it was synced

			// TODO: getOrders
			// TODO: getFavoriteSpecialist
			// TODO: getFavoriteService
			// TODO: getFavoriteProduct
			// TODO: getSpecialistData - when customer is also as specialist

		};

}

export const isExpense = Tools.createIs<IExpense.DTO>();
export const validExpense = Tools.createValidate<IExpense.DTO>();
export const randomExpense = Tools.createRandom<IExpense.DTO>();
