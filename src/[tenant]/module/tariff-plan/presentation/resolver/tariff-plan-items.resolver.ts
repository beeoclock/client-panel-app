import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import {from, map} from "rxjs";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";


export const tariffPlanItemsResolver: ResolveFn<ETariffPlan[]> = () => {

	const store = inject(TariffPlanStore);

	return from(
		store.init()
	).pipe(
		map(() => {
			return store.items();
		}),
	);

};
