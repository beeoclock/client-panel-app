import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {computed, inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";

export interface ITariffPlanState {
	items: ETariffPlan[];
}

const initialState: ITariffPlanState = {
	items: [],
};

export const TariffPlanStore = signalStore(
	withState(initialState),
	withComputed(({items}) => ({
		itemsCount: computed(() => items().length),
	})),
	withMethods((store) => {
		return {
			async fill(): Promise<void> {
				try {
					const {items} = await inject(SharedUow).tariffPlan.repository.findAsync({
						page: 1,
						pageSize: 3,
						state: StateEnum.active,
						orderDir: OrderDirEnum.DESC,
						orderBy: OrderByEnum.UPDATED_AT,
					});
					patchState(store, (state) => {
						state.items = items.map(ETariffPlan.fromRaw);
						return state;
					});
				} catch (e) {
					inject(NGXLogger).error(e);
				}
			},
		}
	}),
	withHooks((store) => {
		return {
			onInit() {
				inject(TENANT_ID).pipe(takeUntilDestroyed()).subscribe(() => {
					store.fill();
				});
			},
		};
	}),
);
