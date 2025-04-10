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
import {BusinessProfileModule} from "@tenant/business-profile/business-profile.module";
import {TenantPaymentStateEffect} from "@tenant/tenant.payment-state.effect";
import {TariffPlanDomainModule} from "@tenant/tariff-plan/tariff-plan.domain.module";

@NgModule({
	providers: [
		TenantPaymentStateEffect,
		SharedUow.provide,

		...tenantTokens,

		importProvidersFrom(
			BusinessProfileModule,
			OrderDomainModule,
			TariffPlanDomainModule
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
		EventModule,
	],
})
export class TenantModule {

	private readonly tenantEffect = inject(TenantPaymentStateEffect);

}

export default TenantModule;
