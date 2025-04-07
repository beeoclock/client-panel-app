import {ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation} from "@angular/core";
import EPayment from "@tenant/payment/domain/entity/e.payment";
import {
	PaymentStatusStyleDirective
} from "@shared/presentation/directives/payment-status-style/payment-status-style.directive";
import {CurrencyPipe} from "@angular/common";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslatePipe} from "@ngx-translate/core";
import {AnchorTypeEnum} from "@tenant/payment/domain/enum/anchor.type.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EOrder from "@tenant/order/domain/entity/e.order";
import {
	CardItemLightweightOrderComponent
} from "@tenant/order/presentation/ui/component/list/card/item-lightweight/card.item.order.component";
import {
	CardItemOrderService
} from "@tenant/order/presentation/ui/component/list/card/item-lightweight/card.item.order.service";
import {Store} from "@ngxs/store";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";

@Component({
	selector: 'payment-details',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'bg-neutral-100',
	},
	imports: [
		PaymentStatusStyleDirective,
		CurrencyPipe,
		DynamicDatePipe,
		TranslatePipe,
		CardItemLightweightOrderComponent,
		StandardDetailsEntityComponent
	],
	providers: [
		CardItemOrderService
	],
	template: `
		@if (item(); as item) {
			<div class="p-4 flex flex-col space-y-4 ">

				<div class=" flex flex-col gap-2">
					<div class="text-4xl uppercase font-extrabold">
						{{ item.amount | currency: item.currency : undefined : '1.2-2' }}
					</div>
					<div class="flex flex-wrap gap-2">
						<div class="uppercase font-light">
							<div paymentStatusStyle textSize="text-sm" [status]="item.status"></div>
						</div>
						@if (item.paymentDate) {
							<div class="bg-white rounded-full shadow-sm px-2 py-1">
								{{ item.paymentDate | dynamicDate }}
							</div>
						}
						<div class="bg-white rounded-full shadow-sm px-2 py-1">
							{{ ('payment.providerType.' + item.providerType + '.label') | translate }}
						</div>
						<div class="bg-white rounded-full shadow-sm px-2 py-1">
							{{ ('payment.method.' + item.method + '.label') | translate }}
						</div>
					</div>
				</div>

				<!--	Payer	-->
				<div class="flex flex-col gap-1">

					<div class="text-neutral-500 text-xs px-4">
						{{ 'keyword.capitalize.payer' | translate }}
					</div>

					<button (click)="openPayerDetails()" class="cursor-pointer hover:ring-2 rounded-2xl">

						<div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 ">

							<div class="flex justify-between items-center">
								<div>
									{{ item.payerToString() }}
								</div>
							</div>

						</div>

					</button>

				</div>

				@switch (item.anchorType) {

					@case (anchorTypeEnum.order) {

						<!--	Order	-->
						<div class="flex flex-col gap-1">
							<div class="text-neutral-500 text-xs px-4">
								{{ 'keyword.capitalize.ordering' | translate }}
							</div>
							<div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 ">

								<div class="flex justify-between items-center">
									<div>


									</div>
								</div>

							</div>
						</div>

					}
					@case (anchorTypeEnum.service) {

						@if (order(); as order) {

							<!--	Order	-->
							<div>
								<div class="flex justify-between px-4">
									<div class="text-neutral-500 text-xs">
										{{ 'keyword.capitalize.ordering' | translate }}
									</div>
									<div class="text-neutral-400 text-sm uppercase">
										#...{{ item._id.slice(-5) }}
									</div>
								</div>
								<app-card-item-lightweight-order-component [orderDto]="order"/>
							</div>

						}

					}
					@case (anchorTypeEnum.product) {

					}

				}
			</div>
			<standard-details-entity [item]="item"/>
		}
	`
})
export class PaymentDetails {

	public readonly item = input.required<EPayment>();

	public readonly anchorTypeEnum = AnchorTypeEnum;

	private readonly store = inject(Store);
	private readonly sharedUow = inject(SharedUow);

	public readonly order = signal<EOrder | undefined>(undefined);

	public constructor() {
		effect(() => {
			this.initAnchor().then();
		});
	}

	public async initAnchor(): Promise<void> {
		const {anchorType, orderId} = this.item();
		const order = await this.sharedUow.order.repository.findByIdAsync(orderId);
		if (order) {
			this.order.set(EOrder.fromRaw(order));
		}
	}

	public openPayerDetails() {
		const {payer} = this.item();
		if (payer) {
			const action = new CustomerPresentationActions.OpenDetails(payer)
			this.store.dispatch(action);
		}
	}
}

export default PaymentDetails;
