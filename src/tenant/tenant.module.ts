import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tenantRouters} from "@src/tenant/tenant.routers";
import {AbsenceModule} from "@tenant/absence/absence.module";
import {CustomerModule} from "@tenant/customer/customer.module";
import {MemberModule} from "@tenant/member/member.module";
import {OrderModule} from "@tenant/order/order.module";
import {ServiceModule} from "@tenant/service/service.module";
import {PaymentModule} from "@tenant/payment/payment.module";
import {tenantTokens} from "@tenant/tenant.token";
import {SocketState} from "@utility/state/socket/socket.state";
import {NgxsModule} from "@ngxs/store";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {EventModule} from "@tenant/event/event.module";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan-history/presentation/store/tariff-plan-history/tariff-plane-history.store";
import {
	BusinessProfileStore
} from "@tenant/business-profile/presentation/store/business-profile/business-profile.store";
import {TariffPlanStore} from "@tenant/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";
import {BusinessProfileModule} from "@tenant/business-profile/business-profile.module";
import TariffPlanModule from "@tenant/tariff-plan/tariff-plan.module";
import {TariffPlanHistoryModule} from "@tenant/tariff-plan-history/tariff-plan-history.module";

@NgModule({
	providers: [
		{
			provide: SharedUow,
			useClass: SharedUow,
		},

		...tenantTokens,

		BusinessProfileStore,
		TariffPlanStore,
		TariffPlanHistoryStore,
	],
	imports: [
		NgxsModule.forFeature([SocketState]),
		RouterModule.forChild(tenantRouters),

		// MODULE
		AbsenceModule,
		CustomerModule,
		MemberModule,
		OrderModule,
		ServiceModule,
		PaymentModule,
		BusinessProfileModule,
		TariffPlanModule,
		TariffPlanHistoryModule,
		EventModule,
	],
})
export class TenantModule {

}

export default TenantModule;
