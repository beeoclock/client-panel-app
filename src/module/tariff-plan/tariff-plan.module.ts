import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tariffPlan/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tariffPlan/infrastructure/api/get/get.api";
import {PutApi} from "@tariffPlan/infrastructure/api/put/put.api";
import {PostStripeWebhookApi} from "@tariffPlan/infrastructure/api/post/post.stripe-webhook.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tariffPlan/infrastructure/api/get/get-item.api";
import {NgxsModule} from "@ngxs/store";
import {
	DateRangeReportAnalyticState
} from "@module/analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {PeerCustomerOrderState} from "@order/infrastructure/state/peer-customer/peer-customer.order.state";
import {
	CalendarWithSpecialistsState
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {SmsUsedAnalyticState} from "@module/analytic/infrastructure/store/sms-used/sms-used.analytic.state";
import {EventState} from "@event/infrastructure/state/event/event.state";
import {CalendarState} from "@event/infrastructure/state/calendar/calendar.state";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {TariffPlanState} from "@tariffPlan/infrastructure/state/absence/tariff-plan.state";
import {
	TariffPlanIndexedDBDataProvider
} from "@tariffPlan/infrastructure/data-provider/indexedDB/tariff-plan.indexedDB.data-provider";
import {
	TariffPlanDexieAdapterIndexedDBDataProvider
} from "@tariffPlan/infrastructure/data-provider/indexedDB/adapter/tariff-plan.dexie.adapter.indexedDB.data-provider";
import {TariffPlanRepository} from "@tariffPlan/infrastructure/repository/tariff-plan.repository";
import {TariffPlanService} from "@core/business-logic/tariif-plan/service/tariff-plan.service";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			DateRangeReportAnalyticState,
			PeerCustomerOrderState,
			TariffPlanState,

			// Calendar Module
			CalendarWithSpecialistsState,

			// Sms Module
			SmsUsedAnalyticState,

			// Date Module
			DateRangeReportAnalyticState,

			// Calendar Module
			CalendarState,

			// Event module
			EventState,
			DateRangeReportAnalyticState,
		]),
	],
	providers: [

		// Api
		PostStripeWebhookApi,
		GetApi,
		GetItemApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		TariffPlanIndexedDBDataProvider,

		// Adapter
		TariffPlanDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: TariffPlanRepository,
			useFactory: () => new TariffPlanRepository(
				inject(TariffPlanIndexedDBDataProvider),
			)
		},
		{
			provide: TariffPlanService,
			useFactory: () => new TariffPlanService(
				inject(TariffPlanRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class TariffPlanModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly tariffPlanService = inject(TariffPlanService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.tariffPlan = this.tariffPlanService;
	}

}
