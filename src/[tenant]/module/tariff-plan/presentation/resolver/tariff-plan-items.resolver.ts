import {ResolveFn} from "@angular/router";
import {inject} from "@angular/core";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";
import {filter, take} from "rxjs";
import {is} from "@core/shared/checker";


export const tariffPlanItemsResolver: ResolveFn<ETariffPlan[]> = () => {

	const store = inject(TariffPlanStore);
	store.init();
	return store.items$.pipe(
		filter(is.array_not_empty),
		take(1),
	);

};
