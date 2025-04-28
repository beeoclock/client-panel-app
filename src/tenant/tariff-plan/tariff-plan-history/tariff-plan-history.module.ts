import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	TariffPlanHistoryService
} from "@tenant/tariff-plan/tariff-plan-history/domain/service/tariff-plan-history.service";
import {
	TariffPlanHistoryDexieAdapterIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-provider/indexedDB/adapter/tariff-plan-history.dexie.adapter.indexedDB.data-provider";
import {
	TariffPlanHistoryRepository
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/repository/tariff-plan-history.repository";
import {
	TariffPlanHistoryIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-provider/indexedDB/tariff-plan-history.indexedDB.data-provider";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import {
	GetTenantTariffPlanActualApi
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-source/api/get/get.tenant-tariff-plan.actual.api";
import {
	GetTenantTariffPlanPagedApi
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-source/api/get/get.tenant-tariff-plan.paged.api";

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
			useFactory: () => {
				const dataProvider = inject(TariffPlanHistoryIndexedDBDataProvider);
				const repository = new TariffPlanHistoryRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: TariffPlanHistoryService,
			useFactory: () => {
				const repository = inject(TariffPlanHistoryRepository);
				const service = new TariffPlanHistoryService();
				service.repository = repository;
				service.initDbHandler();
				return service;
			},
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
