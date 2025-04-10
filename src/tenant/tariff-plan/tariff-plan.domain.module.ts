import {importProvidersFrom, NgModule} from "@angular/core";
import TariffPlanModule from "@tenant/tariff-plan/tariff-plan/tariff-plan.module";
import {TariffPlanHistoryModule} from "@tenant/tariff-plan/tariff-plan-history/tariff-plan-history.module";
import {TariffPlanStore} from "@tenant/tariff-plan/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";

@NgModule({
	providers: [
		TariffPlanStore,
		TariffPlanHistoryStore,
		importProvidersFrom(
			TariffPlanModule,
			TariffPlanHistoryModule,
		)
	]
})
export class TariffPlanDomainModule {


}
