import {inject, NgModule} from "@angular/core";
import {CustomerRepository} from "@tenant/customer/infrastructure/repository/customer.repository";
import {ApiDataProvider} from "@tenant/customer/infrastructure/data-provider/api.data-provider";
import {
	CustomerIndexedDBDataProvider
} from "@tenant/customer/infrastructure/data-provider/indexedDB/customer.indexedDB.data-provider";
import {GetApi} from "@tenant/customer/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/customer/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/customer/infrastructure/data-source/api/post.api";
import {
	CustomerDexieAdapterIndexedDBDataProvider
} from "@tenant/customer/infrastructure/data-provider/indexedDB/adapter/customer.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/customer/infrastructure/data-source/api/get-item.api";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";
import {NgxsModule} from "@ngxs/store";
import {EventListCustomerRepository} from "@tenant/customer/infrastructure/repository/event.list.customer.repository";
import {
	UtilityListCustomerRepository
} from "@tenant/customer/infrastructure/repository/utility.list.customer.repository";
import {PushChangesSyncManager} from "@tenant/customer/infrastructure/sync-manager/push.changes.sync-manager";
import {GlobalEventListCustomerRepository} from "@src/token";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	CustomerPresentationState
} from "@tenant/customer/presentation/state/presentation/customer.presentation.state";
import {CustomerDataState} from "@tenant/customer/presentation/state/data/customer.data.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			CustomerDataState,
			CustomerPresentationState,
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
		CustomerIndexedDBDataProvider,

		// Adapter
		CustomerDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: CustomerRepository,
			useFactory: () => {
				const dataProvider = inject(CustomerIndexedDBDataProvider);
				const repository = new CustomerRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: CustomerService,
			useFactory: () => {
				const repository = inject(CustomerRepository);
				const service = new CustomerService();
				service.repository = repository;
				service.initDbHandler();
				return service;
			},
		},
		EventListCustomerRepository,
		{
			provide: GlobalEventListCustomerRepository,
			useExisting: EventListCustomerRepository,
		},
		UtilityListCustomerRepository,

		// Sync Manger
		SyncManager,

		{
			provide: PushChangesSyncManager,
			useFactory: () => new PushChangesSyncManager(
				inject(CustomerIndexedDBDataProvider),
			),
		},

	]
})
export class CustomerModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly customerService = inject(CustomerService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.customer = this.customerService;
	}

	public static readonly providers = [
		{
			provide: GlobalEventListCustomerRepository,
			useExisting: EventListCustomerRepository,
		},
	]

}
