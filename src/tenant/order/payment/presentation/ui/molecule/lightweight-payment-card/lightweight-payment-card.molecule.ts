import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import EPayment, {PaymentStatusColorMap} from "@tenant/order/payment/domain/entity/e.payment";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslatePipe} from "@ngx-translate/core";
import {
	PaymentPresentationActions
} from "@tenant/order/payment/infrastructure/state/presentation/payment.presentation.actions";
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {CurrencyPipe} from "@angular/common";

@Component({
	standalone: true,
	selector: 'lightweight-payment-card-molecule',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		TranslatePipe,
		DynamicDatePipe,
		CurrencyPipe
	],
	template: `
		<bee-card padding="p-0" class="text-sm hover:ring-2">
			<div class="flex flex-col">
				<div class="p-2 flex flex-wrap justify-between items-center rounded-t-2xl {{ paymentStatusColorMap[item().status].bg }} {{ paymentStatusColorMap[item().status].text }}">

					<div class="flex flex-1 justify-between cursor-pointer text-lg font-bold">
						{{ item().amount | currency: item().currency }}
					</div>

					<div class="flex items-center gap-2">
						{{ ('payment.status.' + item().status + '.label') | translate  }}
					</div>

				</div>
				<div class="flex flex-col cursor-pointer" (click)="singleClick()">

					@let customer = item().payer ;

					<div class="w-full bg-[#FFFFFF] rounded-b-2xl">
						<div class="flex justify-between border-b-stone-100 border-b">
							<div
								class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ 'keyword.capitalize.payer' | translate }}:
							</div>
							<div class="inline-flex items-center gap-2 rounded-md text-sm font-medium py-2.5 px-3 text-[#11141A]">

								@if (customer.customerType === customerTypeEnum.anonymous) {

									<div
										class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-neutral-700">
										<i class="bi bi-person"></i>
									</div>

								} @else {

									@let firstName = customer.firstName ?? '' ;
									@let lastName = customer.lastName ?? '' ;

									<div
										class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-yellow-700">
										{{ firstName?.[0] ?? '' }}{{ lastName?.[0] ?? '' }}
									</div>

								}

								@switch (customer.customerType) {

									@case (customerTypeEnum.unregistered) {
										{{ customer.firstName }} {{ customer.lastName }}
									}
									@case (customerTypeEnum.regular) {
										{{ customer.firstName }} {{ customer.lastName }}
									}
									@case (customerTypeEnum.anonymous) {
										{{ 'keyword.capitalize.anonymous' | translate }}
									}
								}
							</div>
						</div>
						<div class="flex justify-between border-b-stone-100 border-b">
							<div
								class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ 'keyword.capitalize.paymentProviderType' | translate }}:
							</div>
							<div class="inline-flex items-center gap-2 rounded-md text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ ('payment.providerType.' + item().providerType + '.label') | translate  }}
							</div>
						</div>
						<div class="flex justify-between border-b-stone-100 border-b">
							<div
								class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ 'keyword.capitalize.paymentMethod' | translate }}:
							</div>
							<div class="inline-flex items-center gap-2 rounded-md text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ ('payment.method.' + item().method + '.label') | translate  }}
							</div>
						</div>

						@if (item().paymentDate; as paymentDate) {
							<div class="flex justify-between border-b-stone-100 border-b">
								<div
									class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
									{{ 'keyword.capitalize.paymentDate' | translate }}:
								</div>
								<div class="inline-flex items-center gap-2 rounded-md text-sm font-medium py-2.5 px-3 text-[#11141A]">
									{{ paymentDate | dynamicDate }}
								</div>
							</div>
						}
						<div class="flex justify-between border-b-stone-100 border-b  rounded-b-2xl">
							<div
								class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ 'keyword.capitalize.createdAt' | translate }}:
							</div>
							<div class="inline-flex items-center gap-2 rounded-md text-sm font-medium py-2.5 px-3 text-[#11141A]">
								{{ item().createdAt | dynamicDate }}
							</div>
						</div>

					</div>
				</div>
			</div>
		</bee-card>
	`
})
export class LightweightPaymentCardMolecule {

	public readonly item = input.required<EPayment>();

	public readonly customerTypeEnum = CustomerTypeEnum;
	public readonly paymentStatusColorMap = PaymentStatusColorMap;

	private readonly store = inject(Store)

	public singleClick() {

		const item = this.item();
		const action = new PaymentPresentationActions.OpenDetails(item);
		this.store.dispatch(action);

	}

}
