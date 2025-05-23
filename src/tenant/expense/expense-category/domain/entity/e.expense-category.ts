import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";


export class EExpenseCategory extends ABaseEntity<'ExpenseCategoryDto', IExpenseCategory.DTO, IExpenseCategory.EntityRaw> implements IExpenseCategory.EntityRaw {

	override object = 'ExpenseCategoryDto' as const;

	name!: string;
	description!: string;

	public override toDTO(): IExpenseCategory.DTO {
		return EExpenseCategory.toDTO(this);
	}

	public static toDTO(data: IExpenseCategory.EntityRaw): IExpenseCategory.DTO {
		return {
			description: data.description,
			name: data.name,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IExpenseCategory.DTO): EExpenseCategory {
		return new EExpenseCategory(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IExpenseCategory.EntityRaw): EExpenseCategory {
		return new EExpenseCategory(data);
	}

}

export default EExpenseCategory;
