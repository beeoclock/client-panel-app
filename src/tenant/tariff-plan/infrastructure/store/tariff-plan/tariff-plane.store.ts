import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from "@ngrx/signals";
import ETariffPlan from "@tenant/tariff-plan/domain/entity/e.tariff-plan";
import {computed, inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	PatchTenantTariffPlanChangeApi
} from "@tenant/tariff-plan/infrastructure/data-source/api/patch/patch.tenant-tariff-plan.change.api";
import {environment} from "@environment/environment";
import {IsOnlineService} from "@core/cdk/is-online.service";
import {StateEnum} from "@core/shared/enum/state.enum";
import {GetBillingPortalApi} from "@tenant/tariff-plan/infrastructure/data-source/api/get/get.billing-portal.api";

export interface ITariffPlanState {
    items: ETariffPlan[];
	billingLink: string;
}

const initialState: ITariffPlanState = {
    items: [],
	billingLink: '',
};

export const TariffPlanStore = signalStore(
    withState(initialState),
    withComputed(({items}) => ({
        itemsCount: computed(() => items().length),
    })),
    withProps(({items}) => {
        return {
			items$: toObservable<ETariffPlan[]>(items),
            sharedUow: inject(SharedUow),
            ngxLogger: inject(NGXLogger),
            isOnlineService: inject(IsOnlineService),
            patchTenantTariffPlanChangeApi: inject(PatchTenantTariffPlanChangeApi.Request),
			getBillingPortalApi: inject(GetBillingPortalApi),
        }
    }),
    withMethods(({sharedUow, ngxLogger, isOnlineService, patchTenantTariffPlanChangeApi, getBillingPortalApi, ...store}) => {
        return {
            async fillItems(): Promise<void> {
                try {
                    const {items} = await sharedUow.tariffPlan.repository.findAsync({
                        page: 1,
                        pageSize: environment.config.pagination.pageSize,
                        state: StateEnum.active,
                        orderDir: OrderDirEnum.ASC,
                        orderBy: OrderByEnum.CREATED_AT,
                    });
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
                    const isOffline = isOnlineService.isOffline();
                    if (isOffline) {
                        return false;
                    }
                    const {url: checkoutSessionUrl} = await patchTenantTariffPlanChangeApi.executeAsync({
						redirectUrl: {
							cancelRedirectUrl: window.location.origin,
							successRedirectUrl: window.location.origin,
						},
						tariffPlan: item,
					});
                    if (checkoutSessionUrl.length) {
                        window.location.href = checkoutSessionUrl;
                    } else {
                        // It is a goode case, because it means that business has set card to pay and the tariff plan is active

                        // Read comment for the endpoint at response 200
                        // https://api-dev.beeoclock.com/tariff-plan/documentation/swagger/v1#/default/TenantTariffPlanController_changeTariffPlan
                    }
					return true;
                } catch (e) {
                    ngxLogger.error(e);
					return false;
                }
            },
            async fetchBillingLink() {
                try {
                    const isOffline = isOnlineService.isOffline();
                    if (isOffline) {
                        return;
                    }
                    const {url} = await getBillingPortalApi.executeAsync();
                    patchState(store, (state) => {
						return {
							...state,
							billingLink: url,
						};
					});
                } catch (e) {
                    ngxLogger.error(e);
                }
            },
            async init() {
                await this.fillItems();
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
