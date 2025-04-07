import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";

export namespace IExpense {

	export interface DTO extends IBaseDTO<'ExpenseDto'> {
		totalValue: {
			object: "ExpenseValueDto",
			amount: 0,
			currency: "string"
		},
		expensedAt: "string",
		description: "string",
		items: [
			{
				object: "ExpenseLineItemDTO",
				categories: [
					{
						_version: "1",
						_id: "string",
						stateHistory: [
							{
								state: "active",
								setAt: "string"
							}
						],
						state: "active",
						createdAt: "string",
						updatedAt: "string",
						object: "ExpenseCategoryDto",
						name: "string",
						description: "string"
					}
				],
				itemValue: {
					object: "ExpenseValueDto",
					amount: 100,
					currency: "USD"
				},
				description: "This is a description",
				source: {
					object: "ExpenseSourceDto",
					name: "John Doe",
					sourceId: "5f7b1b3b1f4b1d001f1b1f4b",
					sourceType: "Member"
				}
			}
		]
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
