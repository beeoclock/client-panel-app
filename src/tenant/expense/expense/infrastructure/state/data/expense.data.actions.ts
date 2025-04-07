import {BaseActions} from "@shared/state/base/base.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IExpense} from "@tenant/expense/expense/domain";

export namespace ExpenseDataActions {

	export class CreateItem extends BaseActions.CreateItem<IExpense.EntityRaw> {
		public static override readonly type = '[Expense API] Create Item';
	}

	export class UpdateItem extends BaseActions.UpdateItem<IExpense.EntityRaw> {
		public static override readonly type = '[Expense API] Update Item';
	}

	export class SetState {
		public static readonly type = '[Expense API] SetState';

		constructor(
			public readonly item: IExpense.DTO,
			public readonly state: StateEnum,
		) {
		}
	}


}
