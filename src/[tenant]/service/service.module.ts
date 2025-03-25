import {inject, NgModule} from "@angular/core";
import {PostApi} from "@[tenant]/service/infrastructure/data-source/api/post.api";
import {GetApi} from "@[tenant]/service/infrastructure/data-source/api/get.api";
import {GetItemApi} from "@[tenant]/service/infrastructure/data-source/api/get-item.api";
import {PutApi} from "@[tenant]/service/infrastructure/data-source/api/put.api";
import {ApiDataProvider} from "@[tenant]/service/infrastructure/data-provider/api.data-provider";
import {
	ServiceIndexedDBDataProvider
} from "@[tenant]/service/infrastructure/data-provider/indexedDB/service.indexedDB.data-provider";
import {
	ServiceDexieAdapterIndexedDBDataProvider
} from "@[tenant]/service/infrastructure/data-provider/indexedDB/adapter/service.dexie.adapter.indexedDB.data-provider";
import {ServiceRepository} from "@[tenant]/service/infrastructure/repository/service.repository";
import {ServiceService} from "@core/business-logic/service/service/service.service";
import {SyncManager} from "@[tenant]/service/infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {ServiceState} from "@[tenant]/service/infrastructure/state/service/service.state";
import {PushChangesSyncManager} from "@[tenant]/service/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";

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
			useFactory: () => {
				const dataProvider = inject(ServiceIndexedDBDataProvider);
				const repository = new ServiceRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: ServiceService,
			useFactory: () => {
				const repository = inject(ServiceRepository);
				const service = new ServiceService();
				service.repository = repository;
				service.initDbHandler();
				return service;
			},
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
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.service = this.serviceService;
	}

}
