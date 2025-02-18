import {inject, NgModule} from "@angular/core";
import {CustomerRepository} from "@customer/infrastructure/repository/customer.repository";
import {ApiDataProvider} from "@customer/infrastructure/data-provider/api.data-provider";
import {
	CustomerIndexedDBDataProvider
} from "@customer/infrastructure/data-provider/indexedDB/customer.indexedDB.data-provider";
import {GetApi} from "@customer/infrastructure/api/get.api";
import {PutApi} from "@customer/infrastructure/api/put.api";
import {PostApi} from "@customer/infrastructure/api/post.api";
import {
	CustomerDexieAdapterIndexedDBDataProvider
} from "@customer/infrastructure/data-provider/indexedDB/adapter/customer.dexie.adapter.indexedDB.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@customer/infrastructure/api/get-item.api";
import {CustomerService} from "@core/business-logic/customer/service/customer.service";
import {NgxsModule} from "@ngxs/store";
import {CustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {EventListCustomerRepository} from "@customer/infrastructure/repository/event.list.customer.repository";
import {UtilityListCustomerRepository} from "@customer/infrastructure/repository/utility.list.customer.repository";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			CustomerState,
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
			useFactory: () => new CustomerRepository(
				inject(CustomerIndexedDBDataProvider),
			)
		},
		{
			provide: CustomerService,
			useFactory: () => new CustomerService(
				inject(CustomerRepository),
			)
		},
		EventListCustomerRepository,
		UtilityListCustomerRepository,

		// Sync Manger
		SyncManager,

	]
})
export class CustomerModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly customerService = inject(CustomerService);

}
