import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {BalanceDataActions} from "./balance.data.actions";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";

export type IBalanceState = object;

const defaults = {};

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
