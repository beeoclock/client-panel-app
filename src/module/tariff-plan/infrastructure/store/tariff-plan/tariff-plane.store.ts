import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {computed, inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {PatchTenantTariffPlanChangeApi} from "@tariffPlan/infrastructure/api/patch/patch.tenant-tariff-plan.change.api";
import {Router} from "@angular/router";
import {GetTenantTariffPlanPagedApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.paged.api";
import {environment} from "@environment/environment";
import {IsOnlineService} from "@utility/cdk/is-online.service";
import {GetTenantTariffPlanActualApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.actual.api";

export interface ITariffPlanState {
	items: ETariffPlan[];
	history: ETariffPlan[];
	actual: ETariffPlan | null;
}

const initialState: ITariffPlanState = {
	items: [],
	history: [],
	actual: null,
};

export const TariffPlanStore = signalStore(
	withState(initialState),
	withComputed(({items}) => ({
		itemsCount: computed(() => items().length),
	})),
	withMethods((store) => {
		return {
			async fillItems(): Promise<void> {
				try {
					const {items} = await inject(SharedUow).tariffPlan.repository.findAsync({
						page: 1,
						pageSize: environment.config.pagination.pageSize,
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
			async changeTariffPlanOnto(item: ETariffPlan) {
				const checkoutSessionUrl = await inject(PatchTenantTariffPlanChangeApi).executeAsync(item);
				if (checkoutSessionUrl.length) {
					await inject(Router).navigateByUrl(checkoutSessionUrl);
				} else {
					// It is a goode case, because it means that business has set card to pay and the tariff plan is active

					// Read comment for the endpoint at response 200
					// https://api-dev.beeoclock.com/tariff-plan/documentation/swagger/v1#/default/TenantTariffPlanController_changeTariffPlan
				}
			},
			async fetchHistory() {
				const isOffline = inject(IsOnlineService).isOffline();
				if (isOffline) {
					return;
				}
				try {
					const {items} = await inject(GetTenantTariffPlanPagedApi).executeAsync({
						page: 1,
						pageSize: environment.config.pagination.pageSize,
						orderDir: OrderDirEnum.DESC,
						orderBy: OrderByEnum.UPDATED_AT,
					});
					patchState(store, (state) => {
						state.history = items.map(ETariffPlan.fromRaw);
						return state;
					});
				} catch (e) {
					inject(NGXLogger).error(e);
				}
			},
			async fetchActual() {
				const isOffline = inject(IsOnlineService).isOffline();
				if (isOffline) {
					return;
				}
				try {
					const actual = await inject(GetTenantTariffPlanActualApi).executeAsync();
					patchState(store, (state) => {
						state.actual = ETariffPlan.fromRaw(actual);
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
					store.fillItems();
					store.fetchHistory();
					store.fetchActual();
				});
			},
		};
	}),
);
