import {NgModule} from "@angular/core";
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
} from "@analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {PeerCustomerOrderState} from "@order/infrastructure/state/peer-customer/peer-customer.order.state";
import {AbsenceState} from "@absence/infrastructure/state/absence/absence.state";
import {
	CalendarWithSpecialistsState
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {SmsUsedAnalyticState} from "@analytic/infrastructure/store/sms-used/sms-used.analytic.state";
import {EventState} from "@event/infrastructure/state/event/event.state";
import {CalendarState} from "@event/infrastructure/state/calendar/calendar.state";
import {PushChangesSyncManager} from "@absence/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {AbsenceRepositoryFactory} from "@absence/infrastructure/factories/absence-repository.factory";
import {AbsenceServiceFactory} from "@absence/infrastructure/factories/absence-service.factory";
import {PushChangesSyncManagerFactory} from "@absence/infrastructure/factories/push-changes-sync-manager.factory";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			PeerCustomerOrderState,
			AbsenceState,

			// Calendar Module
			CalendarWithSpecialistsState,

			// Sms Module
			SmsUsedAnalyticState,

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

		AbsenceRepositoryFactory.provide(),
		AbsenceServiceFactory.provide(),
		PushChangesSyncManagerFactory.provide(),

		// Sync Manger
		SyncManager,

	]
})
export class AbsenceModule {

	constructor(
		private readonly syncManager: SyncManager,
		private readonly pushChangesSyncManager: PushChangesSyncManager,
		private readonly absenceService: AbsenceService,
		private readonly sharedUow: SharedUow,
	) {
		this.sharedUow.absence = this.absenceService;
	}

}
