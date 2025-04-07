import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";
import {
	ExpenseCategoryDataActions
} from "@tenant/expense/expense-category/infrastructure/state/data/expense-category.data.actions";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";
import {
	ExpenseCategoryPresentationActions
} from "@tenant/expense/expense-category/infrastructure/state/presentation/expense-category.presentation.actions";

export type IExpenseCategoryState = IBaseState<EExpense>;

const defaults = baseDefaults<EExpense>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IExpenseCategoryState>({
	name: 'expenseCategoryData',
	defaults,
})
@Injectable()
export class ExpenseCategoryDataState {

	private readonly sharedUow = inject(SharedUow);

	@Action(ExpenseCategoryDataActions.CreateItem)
	public async createItem(ctx: StateContext<IExpenseCategoryState>, action: ExpenseCategoryDataActions.CreateItem): Promise<void> {
		await this.sharedUow.expenseCategory.repository.createAsync(EExpenseCategory.fromDTO(action.payload));
		ctx.dispatch(new ExpenseCategoryPresentationActions.CloseForm());
	}

	@Action(ExpenseCategoryDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IExpenseCategoryState>, {payload: item}: ExpenseCategoryDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.expenseCategory.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EExpenseCategory.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.expenseCategory.repository.updateAsync(entity);
			ctx.dispatch(new ExpenseCategoryPresentationActions.CloseForm());
			ctx.dispatch(new ExpenseCategoryPresentationActions.UpdateOpenedDetails(entity));
		}
	}

	@Action(ExpenseCategoryDataActions.SetState)
	public async setState(ctx: StateContext<IExpenseCategoryState>, {
		item,
		state
	}: ExpenseCategoryDataActions.SetState) {
		const foundItem = await this.sharedUow.expenseCategory.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EExpenseCategory.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.expenseCategory.repository.updateAsync(entity);
			ctx.dispatch(new ExpenseCategoryPresentationActions.UpdateOpenedDetails(entity));
		}
	}

}
