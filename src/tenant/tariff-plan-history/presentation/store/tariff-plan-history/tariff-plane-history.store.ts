import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from "@ngrx/signals";
import {computed, inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {NGXLogger} from "ngx-logger";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from "@environment/environment";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";
import {SPECIALIST_LIMIT} from "@tenant/tenant.token";

export interface ITariffPlanHistoryState {
	items: ETariffPlanHistory[];
	actual: ETariffPlanHistory | null;
	trial: ETariffPlanHistory | null;
	effectivePlan: ETariffPlanHistory | null;
}

const initialState: ITariffPlanHistoryState = {
	items: [],
	actual: null,
	trial: null,
	effectivePlan: null,
};

export const TariffPlanHistoryStore = signalStore(
	withState(initialState),
	withComputed(({items, trial}) => ({
		itemsCount: computed(() => items().length),
		hasTrial: computed(() => !!trial()),
	})),
	withProps(({items, effectivePlan}) => {
		return {
			effectivePlan$: toObservable<ETariffPlanHistory | null>(effectivePlan),
			items$: toObservable<ETariffPlanHistory[]>(items),
			sharedUow: inject(SharedUow),
			ngxLogger: inject(NGXLogger),
			specialistLimit$: inject(SPECIALIST_LIMIT),
		}
	}),
	withMethods(({sharedUow, ngxLogger, trial, actual, specialistLimit$, ...store}) => {
		return {
			fillEffectivePlan() {
				const effectivePlan = trial() || actual();
				if (effectivePlan) {
					specialistLimit$.next(effectivePlan.tariffPlan.specialistLimit);
				}
				patchState(store, (state) => {
					return {
						...state,
						effectivePlan,
					};
				});
			},
			async fillTrial() {
				try {
					const trialTariffPlanEntity = await sharedUow.tariffPlanHistory.getTrialTariffPlanEntity();
					patchState(store, (state) => {
						return {
							...state,
							trial: trialTariffPlanEntity,
						};
					});
					this.fillEffectivePlan();
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async fillActual() {
				try {
					const actualTariffPlanEntity = await sharedUow.tariffPlanHistory.getActualTariffPlanEntity();
					patchState(store, (state) => {
						return {
							...state,
							actual: actualTariffPlanEntity,
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
						orderDir: OrderDirEnum.ASC,
						orderBy: OrderByEnum.CREATED_AT,
					});
					patchState(store, (state) => {
						return {
							...state,
							items: items.map(ETariffPlanHistory.fromRaw)
						};
					});
					this.fillEffectivePlan();
				} catch (e) {
					ngxLogger.error(e);
				}
			},
			async init() {
				await this.fillItems();
				await this.fillActual();
				await this.fillTrial();
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
