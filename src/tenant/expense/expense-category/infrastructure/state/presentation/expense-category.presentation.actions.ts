import {BaseActions} from "@shared/state/base/base.actions";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

export namespace ExpenseCategoryPresentationActions {

	export class CloseDetails extends BaseActions.CloseDetails {
		public static override readonly type = '[Expense Category Application] Close Details';
	}

	export class CloseForm extends BaseActions.CloseForm {
		public static override readonly type = '[Expense Category Application] Close Form';
	}

	export class UpdateOpenedDetails extends BaseActions.UpdateOpenedDetails<IExpenseCategory.EntityRaw> {
		public static override readonly type = '[Expense Category Application] Update Opened Details';
	}

	export class OpenDetails extends BaseActions.OpenDetails<IExpenseCategory.EntityRaw> {
		public static override readonly type = '[Expense Category Application] Open Details';
	}

	export class OpenForm extends BaseActions.OpenForm<{
		isEditMode?: boolean;
		item?: IExpenseCategory.DTO;
	}> {
		public static override readonly type = '[Expense Category Application] Open Form';
	}
}
