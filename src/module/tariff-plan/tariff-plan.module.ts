import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tariffPlan/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
    TariffPlanIndexedDBDataProvider
} from "@tariffPlan/infrastructure/data-provider/indexedDB/tariff-plan.indexedDB.data-provider";
import {
    TariffPlanDexieAdapterIndexedDBDataProvider
} from "@tariffPlan/infrastructure/data-provider/indexedDB/adapter/tariff-plan.dexie.adapter.indexedDB.data-provider";
import {TariffPlanRepository} from "@tariffPlan/infrastructure/repository/tariff-plan.repository";
import {TariffPlanService} from "@core/business-logic/tariif-plan/service/tariff-plan.service";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";

@NgModule({
    providers: [

        // Data Provider
        ApiDataProvider,
        TariffPlanIndexedDBDataProvider,

        // Adapter
        TariffPlanDexieAdapterIndexedDBDataProvider,

        // Repository
        {
            provide: TariffPlanRepository,
            useFactory: () => new TariffPlanRepository(
                inject(TariffPlanIndexedDBDataProvider),
            )
        },
        {
            provide: TariffPlanService,
            useFactory: () => new TariffPlanService(
                inject(TariffPlanRepository),
            )
        },

        // Sync Manger
        SyncManager,

    ]
})
export class TariffPlanModule {

    /**
     * Don't remove this, it's declared here to be created in run time
     * @private
     */
    private readonly syncManager = inject(SyncManager);
    private readonly tariffPlanStore = inject(TariffPlanStore);
    private readonly tariffPlanService = inject(TariffPlanService);
    private readonly sharedUow = inject(SharedUow);

    public constructor() {
        this.sharedUow.tariffPlan = this.tariffPlanService;
        this.tariffPlanStore.init().then();
    }

}
