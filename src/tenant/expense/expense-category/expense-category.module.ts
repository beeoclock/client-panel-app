import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/expense/expense-category/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tenant/expense/expense-category/infrastructure/data-source/api/get.api";
import {PostApi} from "@tenant/expense/expense-category/infrastructure/data-source/api/post.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {NgxsModule} from "@ngxs/store";
import {
	PushChangesSyncManager
} from "@tenant/expense/expense-category/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	ExpenseCategoryDataState
} from "@tenant/expense/expense-category/infrastructure/state/data/expense-category.data.state";
import {
	ExpenseCategoryPresentationState
} from "@tenant/expense/expense-category/infrastructure/state/presentation/expense-category.presentation.state";
import {
	ExpenseCategoryIndexedDBDataProvider
} from "@tenant/expense/expense-category/infrastructure/data-provider/indexedDB/expense–category.indexedDB.data-provider";
import {
	ExpenseCategoryDexieAdapterIndexedDBDataProvider
} from "@tenant/expense/expense-category/infrastructure/data-provider/indexedDB/adapter/expense–category.dexie.adapter.indexedDB.data-provider";
import {ExpenseCategoryService} from "@tenant/expense/expense-category/domain/service/expense-category.service";
import {
	ExpenseCategoryRepository
} from "@tenant/expense/expense-category/infrastructure/repository/expense-category.repository";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			ExpenseCategoryDataState,
			ExpenseCategoryPresentationState,
		]),
	],
	providers: [

		// Api
		GetApi,
		PostApi,

		// Data Provider
		ApiDataProvider,
		ExpenseCategoryIndexedDBDataProvider,

		// Adapter
		ExpenseCategoryDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: ExpenseCategoryRepository,
			useFactory: () => {
				const dataProvider = inject(ExpenseCategoryIndexedDBDataProvider);
				const repository = new ExpenseCategoryRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: ExpenseCategoryService,
			useFactory: () => {
				const repository = inject(ExpenseCategoryRepository);
				const service = new ExpenseCategoryService();
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
				inject(ExpenseCategoryIndexedDBDataProvider),
			),
		},

	]
})
export class ExpenseCategoryModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly service = inject(ExpenseCategoryService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.expenseCategory = this.service;
	}

}
