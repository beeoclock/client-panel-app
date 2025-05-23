import {inject, NgModule} from "@angular/core";
import {OrderServiceRepository} from "@tenant/order/order-service/infrastructure/repository/order-service.repository";
import {ApiDataProvider} from "@tenant/order/order-service/infrastructure/data-provider/api.data-provider";
import {
	OrderServiceIndexedDBDataProvider
} from "@tenant/order/order-service/infrastructure/data-provider/indexedDB/order-service.indexedDB.data-provider";
import {GetApi} from "@tenant/order/order-service/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/order/order-service/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/order/order-service/infrastructure/data-source/api/post.api";
import {
	OrderServiceDexieAdapterIndexedDBDataProvider
} from "@tenant/order/order-service/infrastructure/data-provider/indexedDB/adapter/order-service.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/order/order-service/infrastructure/data-source/api/get-item.api";
import {OrderServiceService} from "@tenant/order/order-service/domain/service/order-service.service";
import {NgxsModule} from "@ngxs/store";
import {
	PushChangesSyncManager
} from "@tenant/order/order-service/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	OrderServicePresentationState
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.state";
import {OrderServiceDataState} from "@tenant/order/order-service/infrastructure/state/data/order-service.data.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			OrderServiceDataState,
			OrderServicePresentationState,
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
		OrderServiceIndexedDBDataProvider,

		// Adapter
		OrderServiceDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: OrderServiceRepository,
			useFactory: () => {
				const dataProvider = inject(OrderServiceIndexedDBDataProvider);
				const repository = new OrderServiceRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: OrderServiceService,
			useFactory: () => {
				const repository = inject(OrderServiceRepository);
				const service = new OrderServiceService();
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
				inject(OrderServiceIndexedDBDataProvider),
			),
		},

	]
})
export class OrderServiceModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly orderServiceService = inject(OrderServiceService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.orderService = this.orderServiceService;
	}

}
