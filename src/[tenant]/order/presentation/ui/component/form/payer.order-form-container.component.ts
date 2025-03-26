import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	CustomerTypeCustomerComponent
} from "@[tenant]/customer/presentation/ui/component/form/by-customer-type/customer-type.customer.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@[tenant]/customer/presentation/form";
import {ServiceOrderFormArray} from "@[tenant]/order/presentation/form/service.order.form";

@Component({
	standalone: true,
	selector: 'payer-order-form-container',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		CustomerTypeCustomerComponent,
		TranslateModule
	],
	template: `
		<bee-card>
			<app-customer-type-customer-component
				[form]="payerForm">
				<div class="font-bold" slot="label">{{ 'keyword.capitalize.payer' | translate }}</div>
				<div slot="banner" customer-type="new"
					 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
					<div class="font-bold">
						<i class="bi bi-exclamation-triangle-fill"></i>
						{{ 'keyword.capitalize.warning' | translate }}
					</div>
					<div>
						{{ 'order.form.payment.payer.case.new.hint' | translate }}
					</div>
				</div>

				<div slot="banner" customer-type="unregistered"
					 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
					<div class="font-bold">
						<i class="bi bi-exclamation-triangle-fill"></i>
						{{ 'keyword.capitalize.warning' | translate }}
					</div>
					<div>
						{{ 'order.form.payment.payer.case.unregistered.hint' | translate }}
					</div>
				</div>
			</app-customer-type-customer-component>
		</bee-card>
	`
})
export class PayerOrderFormContainerComponent {
	@Input({required: true})
	public payerForm!: CustomerForm;

	@Input({required: true})
	public serviceOrderArrayForm!: ServiceOrderFormArray;
}
