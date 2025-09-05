import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	resource,
	ResourceRef,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {
	LightweightPaymentCardMolecule
} from "@tenant/order/payment/presentation/ui/molecule/lightweight-payment-card/lightweight-payment-card.molecule";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {CurrencyPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";

@Component({
	standalone: true,
	selector: 'order-details-payment-section',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		LightweightPaymentCardMolecule,
		CurrencyPipe,
		TranslatePipe
	],
	host: {
		class: 'flex flex-col gap-4'
	},
	template: `
		<div class="border bg-neutral-100 rounded-2xl p-4 flex flex-col gap-4">
			<div class="flex justify-between items-center">
				<div>{{ 'keyword.capitalize.amountToPay' | translate }}</div>
				<div>{{ amountToPay() | currency }}</div>
			</div>
			<div class="flex justify-between items-center">
				<div>{{ 'keyword.capitalize.amountPaid' | translate }}</div>
				<div>{{ amountPaid() | currency }}</div>
			</div>
			@if (amountPaid() < amountToPay()) {
				<button (click)="registerPayment()"
						class="w-full rounded-2xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors">
					{{ 'keyword.capitalize.registerPayment' | translate }}
				</button>
			} @else {
				<div class="bg-green-200 border border-green-300 text-center text-green-800 p-2 rounded-lg w-full">
					{{ 'keyword.capitalize.paid' | translate }}
					<i class="bi bi-cart-check"></i>
				</div>
			}
		</div>
		@for (payment of resource.value(); track payment._id) {
			<lightweight-payment-card-molecule [item]="payment"/>
		}
	`
})
export class OrderDetailsPaymentSectionComponent {

	public readonly order = input.required<EOrder>();
	private readonly page = signal(1);

	private readonly store = inject(Store);
	private readonly sharedUow = inject(SharedUow);
	private readonly actions$ = inject(Actions);

	private readonly paymentCreateCase = this.actions$.pipe(
		ofActionSuccessful(
			PaymentDataActions.CreateItem,
		),
	).subscribe((action) => {
		this.resource.reload();
	})

	public readonly amountToPay = computed(() => {
		const order = this.order();
		const {services, products} = order;
		const totalServices = services.reduce((acc, service) => acc + (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0), 0);
		const totalProducts = products.reduce((acc, product) => {
			return acc + (product.productSnapshot.price.value * product.quantity);
		}, 0);
		return totalServices + totalProducts;
	});

	public readonly amountPaid = computed(() => {
		const payments = this.resource.value();
		return payments.reduce((acc, payment) => acc + payment.amount, 0);
	})

	public readonly resource: ResourceRef<EPayment[]> = resource({
		defaultValue: [],
		params: () => ({
			orderId: this.order()._id,
			page: this.page(),
		}),
		loader: async ({params: {orderId, page}}) => {

			const {items} = await this.sharedUow.payment.repository.findAsync({
				orderId,
				page: 1,
				pageSize: page * 10,
				orderBy: OrderByEnum.CREATED_AT,
				orderDir: OrderDirEnum.DESC,
			});

			const entities = EPayment.fromRawList(items);

			return entities;

		}
	});

	public async registerPayment() {
		const action = new OrderActions.Checkout({
			orderId: this.order()._id,
		})
		this.store.dispatch(action);
	}


}
