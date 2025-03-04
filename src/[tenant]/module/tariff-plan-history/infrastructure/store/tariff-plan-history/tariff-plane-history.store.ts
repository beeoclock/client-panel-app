import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from "@ngrx/signals";
import {computed, inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";

import {StateEnum} from "@core/shared/enum/state.enum";

export interface ITariffPlanHistoryState {
	items: ETariffPlanHistory[];
	actual: ETariffPlanHistory | null;
}

const initialState: ITariffPlanHistoryState = {
	items: [],
	actual: null,
};

export const TariffPlanHistoryStore = signalStore(
	withState(initialState),
	withComputed(({items}) => ({
		itemsCount: computed(() => items().length),
	})),
	withProps((store) => {
		return {
			sharedUow: inject(SharedUow),
			ngxLogger: inject(NGXLogger),
		}
	}),
	withMethods(({sharedUow, ngxLogger, ...store}) => {
		return {
			async fillActual() {
				try {
					const {items} = await sharedUow.tariffPlanHistory.repository.findAsync({
						page: 1,
						pageSize: 1,
						status: 'active',
						state: StateEnum.active,
						orderDir: OrderDirEnum.ASC,
						orderBy: OrderByEnum.UPDATED_AT,
					});
					patchState(store, (state) => {
						return {
							...state,
							actual: items.map(ETariffPlanHistory.fromRaw)[0],
						};
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async fillItems(): Promise<void> {
				try {
					const {items} = await sharedUow.tariffPlanHistory.repository.findAsync({
						page: 1,
						pageSize: environment.config.pagination.pageSize,
						// state: StateEnum.active,
						orderDir: OrderDirEnum.ASC,
						orderBy: OrderByEnum.UPDATED_AT,
					});
					console.log({items})
					patchState(store, (state) => {
						return {
							...state,
							items: items.map(ETariffPlanHistory.fromRaw)
						};
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async init() {
				await this.fillItems();
				await this.fillActual();
				console.log(store.items());
			}
		}
	}),
	withHooks((store) => {
		return {
			onInit() {
				inject(TENANT_ID).pipe(takeUntilDestroyed()).subscribe(() => {
					store.init();
				});
			},
		};
	}),
);
