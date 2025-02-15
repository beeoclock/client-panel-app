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

@NgModule({
	providers: [

		// Api
		PostApi,
		GetApi,
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

		// Sync Manger
		SyncManager,

	]
})
export class AbsenceModule {

	private readonly syncManager = inject(SyncManager);

}
