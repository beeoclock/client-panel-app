import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IExpense} from "@tenant/expense/expense/domain";


export class EExpense extends ABaseEntity<'ExpenseDto', IExpense.DTO, IExpense.EntityRaw> implements IExpense.EntityRaw {

	override object = 'ExpenseDto' as const;

	totalValue!: IExpense.IValue;
	expensedAt!: string;
	description!: string;
	items!: IExpense.ILineItem[];

	public override toDTO(): IExpense.DTO {
		return EExpense.toDTO(this);
	}

	public static toDTO(data: IExpense.EntityRaw): IExpense.DTO {
		return {
			description: data.description,
			expensedAt: data.expensedAt,
			items: data.items,
			totalValue: data.totalValue,


			_id: data._id,
			state: data.state,
			object: data.object,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IExpense.DTO): EExpense {
		return new EExpense(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IExpense.EntityRaw): EExpense {
		return new EExpense(data);
	}

	/**
	 * Tools
	 */

	// public static readonly is = {
	// 	dto: Tools.createIs<ICustomer.DTO>(),
	// 	entity: Tools.createIs<ICustomer.Entity>(),
	// };
	// public static readonly isValid = {
	// 	dto: Tools.createValidate<ICustomer.DTO>(),
	// 	entity: Tools.createValidate<ICustomer.Entity>(),
	// };
	// public static readonly getRandom = {
	// 	dto: Tools.createRandom<ICustomer.DTO>(),
	// 	entity: Tools.createRandom<ICustomer.Entity>(),
	// };

}

export default EExpense;
