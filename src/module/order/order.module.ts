import {inject, NgModule} from "@angular/core";
import {OrderRepository} from "@order/infrastructure/repository/order.repository";
import {ApiDataProvider} from "@order/infrastructure/data-provider/api.data-provider";
import {OrderIndexedDBDataProvider} from "@order/infrastructure/data-provider/indexedDB/order.indexedDB.data-provider";
import {GetApi} from "@order/infrastructure/api/get.api";
import {PutApi} from "@order/infrastructure/api/put.api";
import {PostApi} from "@order/infrastructure/api/post.api";
import {
	OrderDexieAdapterIndexedDBDataProvider
} from "@order/infrastructure/data-provider/indexedDB/adapter/order.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@order/infrastructure/api/get-item.api";
import {OrderService} from "@core/business-logic/order/service/order.service";
import {NgxsModule} from "@ngxs/store";
import {OrderState} from "@order/infrastructure/state/order/order.state";
import {PushChangesSyncManager} from "@order/infrastructure/sync-manager/push.changes.sync-manager";

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
			useFactory: () => new OrderRepository(
				inject(OrderIndexedDBDataProvider),
			)
		},
		{
			provide: OrderService,
			useFactory: () => new OrderService(
				inject(OrderRepository),
			)
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

}
