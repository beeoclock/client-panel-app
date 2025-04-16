import {patchState, signalStore, withHooks, withProps, withState} from "@ngrx/signals";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {inject} from "@angular/core";
import {SharedUow} from "@core/shared/uow/shared.uow";

export interface IBalanceStoreState {
	balance: EBalance | null;
}

const initialState: IBalanceStoreState = {
	balance: null,
};

export const balanceStore = signalStore(
	withState(initialState),
	withProps(() => ({
		sharedUow: inject(SharedUow),
	})),
	withHooks(({sharedUow, ...store}) => ({
		onInit() {
			sharedUow.balance.getCurrentBalanceAsync().then((balance) => {
				if (!balance) {
					return;
				}
				patchState(store, (state) => {
					return {
						...state,
						balance: EBalance.fromRaw(balance),
					};
				});
			})
		},
	})),
);
