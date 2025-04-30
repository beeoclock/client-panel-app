import {inject, NgModule} from "@angular/core";
import {ApiDataProvider} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-provider/api.data-provider";
import {SyncManager} from "./infrastructure/sync-manager/sync-manager";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	TariffPlanIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-provider/indexedDB/tariff-plan.indexedDB.data-provider";
import {
	TariffPlanDexieAdapterIndexedDBDataProvider
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-provider/indexedDB/adapter/tariff-plan.dexie.adapter.indexedDB.data-provider";
import {TariffPlanRepository} from "@tenant/tariff-plan/tariff-plan/infrastructure/repository/tariff-plan.repository";
import {TariffPlanService} from "@tenant/tariff-plan/tariff-plan/domain/service/tariff-plan.service";
import {GetApi} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/get/get.api";
import {GetItemApi} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/get/get-item.api";
import {
	PatchTenantTariffPlanChangeApi
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/patch/patch.tenant-tariff-plan.change.api";
import {
	PostStripeWebhookApi
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/post/post.stripe-webhook.api";
import {
	PostTenantTariffPlanCancelApi
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/post/post.tenant-tariff-plan.cancel.api";
import {
	PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/post/post.tenant-tariff-plan.change-payment-method-checkout-session.api";
import {
	GetBillingPortalApi
} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/get/get.billing-portal.api";
import {TariffPlanStore} from "@tenant/tariff-plan/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";

@NgModule({
	providers: [

		// Api
		GetApi,
		GetItemApi,
		GetBillingPortalApi,

		PatchTenantTariffPlanChangeApi.Request,

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
			useFactory: () => {
				const dataProvider = inject(TariffPlanIndexedDBDataProvider);
				const repository = new TariffPlanRepository();
				repository.setDataProvider(dataProvider);
				return repository;
			},
		},
		{
			provide: TariffPlanService,
			useFactory: () => {
				const repository = inject(TariffPlanRepository);
				const service = new TariffPlanService();
				service.repository = repository;
				service.initDbHandler();
				return service;
			},
		},

		// Sync Manger
		SyncManager,

	],
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

export default TariffPlanModule;
