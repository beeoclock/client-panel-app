import {inject, NgModule} from "@angular/core";
import {PaymentRepository} from "@payment/infrastructure/repository/payment.repository";
import {ApiDataProvider} from "@payment/infrastructure/data-provider/api.data-provider";
import {
	PaymentIndexedDBDataProvider
} from "@payment/infrastructure/data-provider/indexedDB/payment.indexedDB.data-provider";
import {GetApi} from "@payment/infrastructure/api/get.api";
import {PutApi} from "@payment/infrastructure/api/put.api";
import {PostApi} from "@payment/infrastructure/api/post.api";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@payment/infrastructure/api/get-item.api";
import {PaymentService} from "@core/business-logic/payment/service/payment.service";

@NgModule({
	providers: [

		// Api
		PostApi,
		GetApi,
		GetItemApi,
		PutApi,

		// Data Provider
		ApiDataProvider,
		PaymentIndexedDBDataProvider,

		// Adapter
		PaymentDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: PaymentRepository,
			useFactory: () => new PaymentRepository(
				new PaymentIndexedDBDataProvider(),
			)
		},
		{
			provide: PaymentService,
			useFactory: () => new PaymentService(
				inject(PaymentRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class PaymentModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly paymentService = inject(PaymentService);

}
