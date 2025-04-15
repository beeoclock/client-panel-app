import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {BalanceDataActions} from "./balance.data.actions";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";

export type IBalanceState = IBaseState<EBalance>;

const defaults = baseDefaults<EBalance>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IBalanceState>({
	name: 'balanceData',
	defaults,
})
@Injectable()
export class BalanceDataState {

	private readonly sharedUow = inject(SharedUow);

	@Action(BalanceDataActions.CreateItem)
	public async createItem(ctx: StateContext<IBalanceState>, action: BalanceDataActions.CreateItem): Promise<void> {
		await this.sharedUow.balance.repository.createAsync(EBalance.fromDTO(action.payload));
		ctx.dispatch(new BalancePresentationActions.CloseForm());
	}

}
