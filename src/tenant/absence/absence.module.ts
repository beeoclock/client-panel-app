import {NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/absence/infrastructure/data-provider/api.data-provider";
import {
	AbsenceIndexedDBDataProvider
} from "@tenant/absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider";
import {GetApi} from "@tenant/absence/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/absence/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/absence/infrastructure/data-source/api/post.api";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@tenant/absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/absence/infrastructure/data-source/api/get-item.api";
import {AbsenceService} from "@core/business-logic/absence/service/absence.service";
import {NgxsModule} from "@ngxs/store";
import {AbsenceDataState} from "@tenant/absence/presentation/state/data/absence.data.state";
import {PushChangesSyncManager} from "@tenant/absence/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {AbsencePresentationState} from "@tenant/absence/presentation/state/presentation/absence.presentation.state";
import {AbsenceRepositoryFactory} from "@tenant/absence/infrastructure/factory/absence-repository.factory";
import {AbsenceServiceFactory} from "@tenant/absence/infrastructure/factory/absence-service.factory";
import {PushChangesSyncManagerFactory} from "@tenant/absence/infrastructure/factory/push-changes-sync-manager.factory";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			AbsenceDataState,
			AbsencePresentationState,
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
