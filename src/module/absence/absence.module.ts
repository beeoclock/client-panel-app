import {inject, NgModule} from "@angular/core";
import {AbsenceRepository} from "@absence/infrastructure/repository/absence.repository";
import {ApiDataProvider} from "@absence/infrastructure/data-provider/api.data-provider";
import {
	AbsenceIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider";
import {GetApi} from "@absence/infrastructure/api/get.api";
import {PutApi} from "@absence/infrastructure/api/put.api";
import {PostApi} from "@absence/infrastructure/api/post.api";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@absence/infrastructure/api/get-item.api";
import {AbsenceService} from "@core/business-logic/absence/service/absence.service";
import {NgxsModule} from "@ngxs/store";
import {
	DateRangeReportAnalyticState
} from "@module/analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {PeerCustomerOrderState} from "@order/infrastructure/state/peer-customer/peer-customer.order.state";
import {CustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {ServiceState} from "@service/infrastructure/state/service/service.state";
import {AbsenceState} from "@absence/infrastructure/state/absence/absence.state";
import {MemberState} from "@member/infrastructure/state/member/member.state";
import {OrderState} from "@order/infrastructure/state/order/order.state";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {PaymentState} from "@module/payment/infrastructure/state/payment/payment.state";
import {
	CalendarWithSpecialistsState
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {SmsUsedAnalyticState} from "@module/analytic/infrastructure/store/sms-used/sms-used.analytic.state";
import {EventState} from "@event/infrastructure/state/event/event.state";
import {CalendarState} from "@event/infrastructure/state/calendar/calendar.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			DateRangeReportAnalyticState,
			PeerCustomerOrderState,
			CustomerState,
			ServiceState,
			AbsenceState,
			MemberState,
			OrderState,
			ClientState,
			PaymentState,

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
		PostApi,
		GetApi,
		GetItemApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		AbsenceIndexedDBDataProvider,

		// Adapter
		AbsenceDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: AbsenceRepository,
			useFactory: () => new AbsenceRepository(
				new AbsenceIndexedDBDataProvider(),
			)
		},
		{
			provide: AbsenceService,
			useFactory: () => new AbsenceService(
				inject(AbsenceRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class AbsenceModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly absenceService = inject(AbsenceService);

}
