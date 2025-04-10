import {importProvidersFrom, inject, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tenantRouters} from "@src/tenant/tenant.routers";
import {AbsenceModule} from "@tenant/absence/absence.module";
import {CustomerModule} from "@tenant/customer/customer.module";
import {MemberModule} from "@tenant/member/member.module";
import {OrderDomainModule} from "@tenant/order/order-domain.module";
import {ServiceModule} from "@tenant/service/service.module";
import {tenantTokens} from "@tenant/tenant.token";
import {SocketState} from "@shared/state/socket/socket.state";
import {NgxsModule} from "@ngxs/store";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {EventModule} from "@tenant/event/event.module";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import {
	BusinessProfileStore
} from "@tenant/business-profile/infrastructure/store/business-profile/business-profile.store";
import {TariffPlanStore} from "@tenant/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";
import {BusinessProfileModule} from "@tenant/business-profile/business-profile.module";
import TariffPlanModule from "@tenant/tariff-plan/tariff-plan.module";
import {TariffPlanHistoryModule} from "@tenant/tariff-plan-history/tariff-plan-history.module";
import {TenantPaymentStateEffect} from "@tenant/tenant.payment-state.effect";

@NgModule({
	providers: [
		TenantPaymentStateEffect,
		{
			provide: SharedUow,
			useClass: SharedUow,
		},

		...tenantTokens,

		BusinessProfileStore,
		TariffPlanStore,
		TariffPlanHistoryStore,

		importProvidersFrom(
			OrderDomainModule,
		),
	],
	imports: [
		NgxsModule.forFeature([SocketState]),
		RouterModule.forChild(tenantRouters),

		// MODULE
		AbsenceModule,
		CustomerModule,
		MemberModule,
		ServiceModule,
		BusinessProfileModule,
		TariffPlanModule,
		TariffPlanHistoryModule,
		EventModule,
	],
})
export class TenantModule {

	private readonly tenantEffect = inject(TenantPaymentStateEffect);

}

export default TenantModule;
