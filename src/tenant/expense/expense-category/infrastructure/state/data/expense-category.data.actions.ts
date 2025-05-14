import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

export namespace ExpenseCategoryDataActions {

	export class CreateItem extends BaseActions.CreateItem<IExpenseCategory.EntityRaw> {
		public static override readonly type = '[Expense Category API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IExpenseCategory.EntityRaw> {
		public static override readonly type = '[Expense Category API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Expense Category API] SetState';

		constructor(
			public readonly item: IExpenseCategory.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
