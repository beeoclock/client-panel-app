import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {from, map} from "rxjs";
import {
	TariffPlanHistoryStore
} from "@tariffPlanHistory/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";


export const tariffPlanHistoryItemsResolver: ResolveFn<ETariffPlanHistory[]> = () => {

	const store = inject(TariffPlanHistoryStore);

	return from(
		store.init()
	).pipe(
		map(() => {
			return store.items();
		}),
	);

};
