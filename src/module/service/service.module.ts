import {inject, NgModule} from "@angular/core";
import {PostApi} from "@service/infrastructure/api/post.api";
import {GetApi} from "@service/infrastructure/api/get.api";
import {GetItemApi} from "@service/infrastructure/api/get-item.api";
import {PutApi} from "@service/infrastructure/api/put.api";
import {ApiDataProvider} from "@service/infrastructure/data-provider/api.data-provider";
import {
	ServiceIndexedDBDataProvider
} from "@service/infrastructure/data-provider/indexedDB/service.indexedDB.data-provider";
import {
	ServiceDexieAdapterIndexedDBDataProvider
} from "@service/infrastructure/data-provider/indexedDB/adapter/service.dexie.adapter.indexedDB.data-provider";
import {ServiceRepository} from "@service/infrastructure/repository/service.repository";
import {ServiceService} from "@core/business-logic/service/service/service.service";
import {SyncManager} from "@service/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {ServiceState} from "@service/infrastructure/state/service/service.state";
import {PushChangesSyncManager} from "@core/system/infrastructure/sync-manager/push.changes.sync-manager";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			ServiceState,
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
		ServiceIndexedDBDataProvider,

		// Adapter
		ServiceDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: ServiceRepository,
			useFactory: () => new ServiceRepository(
				inject(ServiceIndexedDBDataProvider),
			)
		},
		{
			provide: ServiceService,
			useFactory: () => new ServiceService(
				inject(ServiceRepository),
			)
		},

		// Sync Manger
		SyncManager,

		{
			provide: PushChangesSyncManager,
			useFactory: () => new PushChangesSyncManager(
				inject(ServiceIndexedDBDataProvider),
			),
		},

	]
})
export class ServiceModule {
	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly serviceService = inject(ServiceService);

}
