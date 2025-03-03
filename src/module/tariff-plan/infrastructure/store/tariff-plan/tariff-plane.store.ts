import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from "@ngrx/signals";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {computed, inject, Injector, runInInjectionContext} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
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
	withProps((store) => {
		return {
			sharedUow: inject(SharedUow),
			ngxLogger: inject(NGXLogger),
			isOnlineService: inject(IsOnlineService),
			injector: inject(Injector),
		}
	}),
	withMethods(({sharedUow, ngxLogger, isOnlineService, injector, ...store}) => {
		return {
			async fillItems(): Promise<void> {
				try {
					const {items} = await sharedUow.tariffPlan.repository.findAsync({
						page: 1,
						pageSize: environment.config.pagination.pageSize,
						// state: StateEnum.active,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						state: null,
						orderDir: OrderDirEnum.ASC,
						orderBy: OrderByEnum.UPDATED_AT,
					});
					console.log({items})
					patchState(store, (state) => {
						return {
							...state,
							items: items.map(ETariffPlan.fromRaw)
						};
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async changeTariffPlanOnto(item: ETariffPlan) {
				try {
					await runInInjectionContext(injector, async () => {
						const isOffline = isOnlineService.isOffline();
						if (isOffline) {
							return;
						}
						const checkoutSessionUrl = await inject(PatchTenantTariffPlanChangeApi).executeAsync(item);
						if (checkoutSessionUrl.length) {
							await inject(Router).navigateByUrl(checkoutSessionUrl);
						} else {
							// It is a goode case, because it means that business has set card to pay and the tariff plan is active

							// Read comment for the endpoint at response 200
							// https://api-dev.beeoclock.com/tariff-plan/documentation/swagger/v1#/default/TenantTariffPlanController_changeTariffPlan
						}
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async fetchHistory() {
				const isOffline = isOnlineService.isOffline();
				if (isOffline) {
					return;
				}
				try {
					await runInInjectionContext(injector, async () => {
						const {items} = await inject(GetTenantTariffPlanPagedApi).executeAsync({
							page: 1,
							pageSize: environment.config.pagination.pageSize,
							orderDir: OrderDirEnum.DESC,
							orderBy: OrderByEnum.UPDATED_AT,
						});
						patchState(store, (state) => {
							return {
								...state,
								history: items.map(ETariffPlan.fromRaw),
							};
						});
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async fetchActual() {
				const isOffline = isOnlineService.isOffline();
				if (isOffline) {
					return;
				}
				try {
					await runInInjectionContext(injector, async () => {
						const actual = await inject(GetTenantTariffPlanActualApi).executeAsync();
						patchState(store, (state) => {
							return {
								...state,
								actual: ETariffPlan.fromRaw(actual),
							};
						});
					});
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async init() {
				await this.fillItems();
				await this.fetchHistory();
				await this.fetchActual();
				console.log(store.items(), store.actual(), store.history());
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
