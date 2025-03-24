import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {tenantRouters} from "@src/[tenant]/tenant.routers";
import {AbsenceModule} from "@absence/absence.module";
import {CustomerModule} from "@customer/customer.module";
import {MemberModule} from "@member/member.module";
import {OrderModule} from "@order/order.module";
import {ServiceModule} from "@service/service.module";
import {PaymentModule} from "@payment/payment.module";
import {BusinessProfileModule} from "@businessProfile/business-profile.module";
import {TariffPlanHistoryModule} from "@tariffPlanHistory/tariff-plan-history.module";
import TariffPlanModule from "@tariffPlan/tariff-plan.module";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";
import {
	TariffPlanHistoryStore
} from "@tariffPlanHistory/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import {tenantTokens} from "@[tenant]/tenant.token";
import {BusinessProfileStore} from "@businessProfile/infrastructure/store/business-profile/business-profile.store";
import {SocketState} from "@utility/state/socket/socket.state";
import {NgxsModule} from "@ngxs/store";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {EventModule} from "@event/event.module";

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
