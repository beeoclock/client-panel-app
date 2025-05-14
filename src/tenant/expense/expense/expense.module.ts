import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/expense/expense/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tenant/expense/expense/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/expense/expense/infrastructure/data-source/api/put.api";
import {PostApi} from "@tenant/expense/expense/infrastructure/data-source/api/post.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tenant/expense/expense/infrastructure/data-source/api/get-item.api";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/expense/expense/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	ExpenseIndexedDBDataProvider
} from "@tenant/expense/expense/infrastructure/data-provider/indexedDB/expense.indexedDB.data-provider";
import {ExpenseRepository} from "@tenant/expense/expense/infrastructure/repository/expense.repository";
import {
	ExpenseDexieAdapterIndexedDBDataProvider
} from "@tenant/expense/expense/infrastructure/data-provider/indexedDB/adapter/expense.dexie.adapter.indexedDB.data-provider";
import {ExpenseService} from "@tenant/expense/expense/domain/service/expense.service";
import {ExpenseDataState} from "@tenant/expense/expense/infrastructure/state/data/expense.data.state";
import {
	ExpensePresentationState
} from "@tenant/expense/expense/infrastructure/state/presentation/expense.presentation.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			ExpenseDataState,
			ExpensePresentationState,
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
		ExpenseIndexedDBDataProvider,

		// Adapter
		ExpenseDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: ExpenseRepository,
			useFactory: () => {
				const dataProvider = inject(ExpenseIndexedDBDataProvider);
				const repository = new ExpenseRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: ExpenseService,
			useFactory: () => {
				const repository = inject(ExpenseRepository);
				const service = new ExpenseService();
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
				inject(ExpenseIndexedDBDataProvider),
			),
		},

	]
})
export class ExpenseModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly service = inject(ExpenseService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.expense = this.service;
	}

}
