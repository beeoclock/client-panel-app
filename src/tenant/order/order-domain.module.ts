import {importProvidersFrom, NgModule} from "@angular/core";
import {PaymentModule} from "@tenant/order/payment/payment.module";
import {OrderServiceModule} from "@tenant/order/order-service/order-service.module";
import {OrderModule} from "@tenant/order/order/order.module";

@NgModule({
	providers: [
		importProvidersFrom(
			OrderModule,
			PaymentModule,
			OrderServiceModule,
		)
	]
})
export class OrderDomainModule {


}
