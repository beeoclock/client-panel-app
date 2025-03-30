import {inject, NgModule} from "@angular/core";
import {PaymentRepository} from "@tenant/payment/infrastructure/repository/payment.repository";
import {ApiDataProvider} from "@tenant/payment/infrastructure/data-provider/api.data-provider";
import {
	PaymentIndexedDBDataProvider
} from "@tenant/payment/infrastructure/data-provider/indexedDB/payment.indexedDB.data-provider";
import {GetApi} from "@tenant/payment/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/payment/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/payment/infrastructure/data-source/api/post.api";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@tenant/payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/payment/infrastructure/data-source/api/get-item.api";
import {PaymentService} from "@tenant/payment/domain/service/payment.service";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/payment/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {PaymentPresentationState} from "@tenant/payment/infrastructure/state/presentation/payment.state";
import {PaymentDataState} from "@tenant/payment/infrastructure/state/data/payment-data-state.service";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			PaymentDataState,
			PaymentPresentationState,
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
		PaymentIndexedDBDataProvider,

		// Adapter
		PaymentDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: PaymentRepository,
			useFactory: () => {
				const dataProvider = inject(PaymentIndexedDBDataProvider);
				const repository = new PaymentRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: PaymentService,
			useFactory: () => {
				const repository = inject(PaymentRepository);
				const service = new PaymentService();
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
				inject(PaymentIndexedDBDataProvider),
			),
		},

	]
})
export class PaymentModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly paymentService = inject(PaymentService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.payment = this.paymentService;
	}

}
