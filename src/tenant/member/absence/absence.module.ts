import {NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/member/absence/infrastructure/data-provider/api.data-provider";
import {
	AbsenceIndexedDBDataProvider
} from "@tenant/member/absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider";
import {GetApi} from "@tenant/member/absence/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/member/absence/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/member/absence/infrastructure/data-source/api/post.api";
import {
	AbsenceDexieAdapterIndexedDBDataProvider
} from "@tenant/member/absence/infrastructure/data-provider/indexedDB/adapter/absence.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/member/absence/infrastructure/data-source/api/get-item.api";
import {AbsenceService} from "@tenant/member/absence/domain/service/absence.service";
import {NgxsModule} from "@ngxs/store";
import {AbsenceDataState} from "@tenant/member/absence/infrastructure/state/data/absence.data.state";
import {PushChangesSyncManager} from "@tenant/member/absence/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	AbsencePresentationState
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.state";
import {AbsenceRepositoryFactory} from "@tenant/member/absence/infrastructure/factory/absence-repository.factory";
import {AbsenceServiceFactory} from "@tenant/member/absence/infrastructure/factory/absence-service.factory";
import {
	PushChangesSyncManagerFactory
} from "@tenant/member/absence/infrastructure/factory/push-changes-sync-manager.factory";

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
