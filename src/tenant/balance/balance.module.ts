import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/balance/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tenant/balance/infrastructure/data-source/api/get.api";
import {PostApi} from "@tenant/balance/infrastructure/data-source/api/post.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetLastItemApi} from "@tenant/balance/infrastructure/data-source/api/get-last-item.api";
import {NgxsModule} from "@ngxs/store";
import {PushChangesSyncManager} from "@tenant/balance/infrastructure/sync-manager/push.changes.sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	BalanceIndexedDBDataProvider
} from "@tenant/balance/infrastructure/data-provider/indexedDB/balance.indexedDB.data-provider";
import {
	BalanceDexieAdapterIndexedDBDataProvider
} from "@tenant/balance/infrastructure/data-provider/indexedDB/adapter/balance.dexie.adapter.indexedDB.data-provider";
import {BalanceRepository} from "@tenant/balance/infrastructure/repository/balance.repository";
import {BalanceService} from "@tenant/balance/domain/service/balance.service";
import {BalancePresentationState} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.state";

@NgModule({
	imports: [
		NgxsModule.forFeature([
			BalancePresentationState,
		]),
	],
	providers: [

		// Api
		PostApi,
		GetApi,
		GetLastItemApi,

		// Data Provider
		ApiDataProvider,
		BalanceIndexedDBDataProvider,

		// Adapter
		BalanceDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: BalanceRepository,
			useFactory: () => {
				const dataProvider = inject(BalanceIndexedDBDataProvider);
				const repository = new BalanceRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: BalanceService,
			useFactory: () => {
				const repository = inject(BalanceRepository);
				const service = new BalanceService();
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
				inject(BalanceIndexedDBDataProvider),
			),
		},

	]
})
export class BalanceModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly pushChangesSyncManager = inject(PushChangesSyncManager);
	private readonly balanceService = inject(BalanceService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.balance = this.balanceService;

	}

}
