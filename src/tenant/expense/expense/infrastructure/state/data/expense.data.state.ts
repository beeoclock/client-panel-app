import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ExpenseDataActions} from "@tenant/expense/expense/infrastructure/state/data/expense.data.actions";
import {
	ExpensePresentationActions
} from "@tenant/expense/expense/infrastructure/state/presentation/expense.presentation.actions";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";

export type IExpenseState = IBaseState<EExpense>;

const defaults = baseDefaults<EExpense>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IExpenseState>({
	name: 'expenseData',
	defaults,
})
@Injectable()
export class ExpenseDataState {

	private readonly sharedUow = inject(SharedUow);

	@Action(ExpenseDataActions.CreateItem)
	public async createItem(ctx: StateContext<IExpenseState>, action: ExpenseDataActions.CreateItem): Promise<void> {
		await this.sharedUow.expense.repository.createAsync(EExpense.fromDTO(action.payload));
		ctx.dispatch(new ExpensePresentationActions.CloseForm());
	}

	@Action(ExpenseDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IExpenseState>, {payload: item}: ExpenseDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.expense.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EExpense.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.expense.repository.updateAsync(entity);
			ctx.dispatch(new ExpensePresentationActions.CloseForm());
			ctx.dispatch(new ExpensePresentationActions.UpdateOpenedDetails(entity));
		}
	}

	@Action(ExpenseDataActions.SetState)
	public async setState(ctx: StateContext<IExpenseState>, {item, state}: ExpenseDataActions.SetState) {
		const foundItem = await this.sharedUow.expense.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = EExpense.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.expense.repository.updateAsync(entity);
			ctx.dispatch(new ExpensePresentationActions.UpdateOpenedDetails(entity));
		}
	}

}
