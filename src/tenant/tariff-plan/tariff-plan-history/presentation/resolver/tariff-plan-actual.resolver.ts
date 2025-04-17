import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {filter, take} from "rxjs";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import ETariffPlanHistory from "@tenant/tariff-plan/tariff-plan-history/domain/entity/e.tariff-plan-history";
import {is} from "@core/shared/checker";


export const tariffPlanActualResolver: ResolveFn<ETariffPlanHistory> = () => {

	const store = inject(TariffPlanHistoryStore);

	store.fillActual();
	return store.effectivePlan$.pipe(
		filter(is.not_null_or_undefined<ETariffPlanHistory>),
		take(1),
	);

};
