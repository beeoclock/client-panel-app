import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tariffPlan/infrastructure/data-provider/api.data-provider";
import {GetApi} from "@tariffPlan/infrastructure/api/get/get.api";
import {PostStripeWebhookApi} from "@tariffPlan/infrastructure/api/post/post.stripe-webhook.api";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {GetItemApi} from "@tariffPlan/infrastructure/api/get/get-item.api";
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
import {PostTenantTariffPlanCancelApi} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.cancel.api";
import {
    PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi
} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.change-payment-method-checkout-session.api";
import {GetTenantTariffPlanActualApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.actual.api";
import {GetTenantTariffPlanPagedApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.paged.api";
import {PatchTenantTariffPlanChangeApi} from "@tariffPlan/infrastructure/api/patch/patch.tenant-tariff-plan.change.api";

@NgModule({
    providers: [

        TariffPlanStore,

        // Api
        GetApi,
        GetTenantTariffPlanActualApi,
        GetTenantTariffPlanPagedApi,
        GetItemApi,

        PatchTenantTariffPlanChangeApi,

        PostStripeWebhookApi,
        PostTenantTariffPlanCancelApi,
        PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi,

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
    private readonly tariffPlanService = inject(TariffPlanService);
    private readonly sharedUow = inject(SharedUow);

    public constructor() {
        this.sharedUow.tariffPlan = this.tariffPlanService;
    }

}
