import {NgModule} from "@angular/core";
import {AbsenceRepository} from "@absence/infrastructure/repository/absence.repository";
import {ApiDataProvider} from "@absence/infrastructure/data-provider/api.data-provider";
import {IndexedDBDataProvider} from "@absence/infrastructure/data-provider/indexedDB/indexedDB.data-provider";
import {GetApi} from "@absence/infrastructure/api/get.api";
import {PutApi} from "@absence/infrastructure/api/put.api";
import {PostApi} from "@absence/infrastructure/api/post.api";
import {
	DexieAdapterIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/adapter/dexie.adapter.indexedDB.data-provider";

@NgModule({
	providers: [

		// Api
		PostApi,
		GetApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		IndexedDBDataProvider,

		// Adapter
		DexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: AbsenceRepository,
			useFactory: () => new AbsenceRepository(
				new IndexedDBDataProvider(),
			)
		},
		// TODO: register in sync manager

	]
})
export class AbsenceModule {

}
