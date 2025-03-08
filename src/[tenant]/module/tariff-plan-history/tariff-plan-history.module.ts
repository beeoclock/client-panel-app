import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tariffPlanHistory/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {TariffPlanHistoryService} from "@core/business-logic/tariif-plan-history/service/tariff-plan-history.service";
import {
	TariffPlanHistoryDexieAdapterIndexedDBDataProvider
} from "@tariffPlanHistory/infrastructure/data-provider/indexedDB/adapter/tariff-plan-history.dexie.adapter.indexedDB.data-provider";
import {TariffPlanHistoryRepository} from "@tariffPlanHistory/infrastructure/repository/tariff-plan-history.repository";
import {
	TariffPlanHistoryIndexedDBDataProvider
} from "@tariffPlanHistory/infrastructure/data-provider/indexedDB/tariff-plan-history.indexedDB.data-provider";
import {
	TariffPlanHistoryStore
} from "@tariffPlanHistory/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import {
	GetTenantTariffPlanActualApi
} from "@tariffPlanHistory/infrastructure/api/get/get.tenant-tariff-plan.actual.api";
import {GetTenantTariffPlanPagedApi} from "@tariffPlanHistory/infrastructure/api/get/get.tenant-tariff-plan.paged.api";

@NgModule({
	providers: [

		GetTenantTariffPlanActualApi,
		GetTenantTariffPlanPagedApi,

		// Data Provider
		ApiDataProvider,
		TariffPlanHistoryIndexedDBDataProvider,

		// Adapter
		TariffPlanHistoryDexieAdapterIndexedDBDataProvider,

		// Repository
		{
			provide: TariffPlanHistoryRepository,
			useFactory: () => new TariffPlanHistoryRepository(
				inject(TariffPlanHistoryIndexedDBDataProvider),
			)
		},
		{
			provide: TariffPlanHistoryService,
			useFactory: () => new TariffPlanHistoryService(
				inject(TariffPlanHistoryRepository),
			)
		},

		// Sync Manger
		SyncManager,

	]
})
export class TariffPlanHistoryModule {

	/**
	 * Don't remove this, it's declared here to be created in run time
	 * @private
	 */
	private readonly syncManager = inject(SyncManager);
	private readonly tariffPlanHistoryStore = inject(TariffPlanHistoryStore);
	private readonly tariffPlanHistoryService = inject(TariffPlanHistoryService);
	private readonly sharedUow = inject(SharedUow);

	public constructor() {
		this.sharedUow.tariffPlanHistory = this.tariffPlanHistoryService;
		this.tariffPlanHistoryStore.init().then();
	}

}
