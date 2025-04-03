import {inject, NgModule} from "@angular/core";
import {OrderRepository} from "@tenant/order/infrastructure/repository/order.repository";
import {ApiDataProvider} from "@tenant/order/infrastructure/data-provider/api.data-provider";
import {
	OrderIndexedDBDataProvider
} from "@tenant/order/infrastructure/data-provider/indexedDB/order.indexedDB.data-provider";
import {GetApi} from "@tenant/order/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/order/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/order/infrastructure/data-source/api/post.api";
import {
	OrderDexieAdapterIndexedDBDataProvider
} from "@tenant/order/infrastructure/data-provider/indexedDB/adapter/order.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/order/infrastructure/data-source/api/get-item.api";
import {OrderService} from "@tenant/order/domain/service/order.service";
import {NgxsModule} from "@ngxs/store";
import {OrderState} from "@tenant/order/infrastructure/state/order/order.state";
import {PushChangesSyncManager} from "@tenant/order/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			OrderState,
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
		OrderIndexedDBDataProvider,

		// Adapter
		OrderDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: OrderRepository,
			useFactory: () => {
				const dataProvider = inject(OrderIndexedDBDataProvider);
				const repository = new OrderRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: OrderService,
			useFactory: () => {
				const repository = inject(OrderRepository);
				const service = new OrderService();
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
				inject(OrderIndexedDBDataProvider),
			),
		},

	]
})
export class OrderModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly orderService = inject(OrderService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.order = this.orderService;
	}

}
