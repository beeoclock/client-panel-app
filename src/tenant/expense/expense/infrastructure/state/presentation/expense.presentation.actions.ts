import {BaseActions} from "@shared/state/base/base.actions";
import {IExpense} from "@tenant/expense/expense/domain";

export namespace ExpensePresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Expense Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Expense Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IExpense.EntityRaw> {
		public static override readonly type = '[Expense Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IExpense.EntityRaw> {
		public static override readonly type = '[Expense Application] Open Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IExpense.DTO;
	}> {
		public static override readonly type = '[Expense Application] Open Form';
	}
}
