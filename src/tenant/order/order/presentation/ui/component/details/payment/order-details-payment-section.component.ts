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
import {CurrencyCodeEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {
	LightweightPaymentCardMolecule
} from "@tenant/order/payment/presentation/ui/molecule/lightweight-payment-card/lightweight-payment-card.molecule";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {BASE_CURRENCY} from "@src/token";
import {CurrencyPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {ModalController} from "@ionic/angular/standalone";
import {
	PaymentModalFormOrganism
} from "@tenant/order/payment/presentation/ui/organism/form/payment.modal.form.organism";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";

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
				<div>{{ amountToPay() | currency: currency() }}</div>
			</div>
			<div class="flex justify-between items-center">
				<div>{{ 'keyword.capitalize.amountPaid' | translate }}</div>
				<div>{{ amountPaid() | currency: currency() }}</div>
			</div>
			@if (amountPaid() < amountToPay()) {
				<button (click)="registerPayment()" class="w-full rounded-2xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors">
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

	private readonly baseCurrency$ = inject(BASE_CURRENCY);
	private readonly modalController = inject(ModalController);
	private readonly sharedUow = inject(SharedUow);
	private readonly actions$ = inject(Actions);

	private readonly paymentCreateCase = this.actions$.pipe(
		ofActionSuccessful(
			PaymentDataActions.CreateItem,
		),
	).subscribe((action) => {
		this.resource.reload();
	})

	public readonly currency = computed(() => {
		const order = this.order();
		const {services, products} = order;
		if (services.length > 0) {
			return services[0].serviceSnapshot.durationVersions[0].prices[0].currency;
		}
		// TODO: Handle products currency if needed
		// if (products.length > 0) {
		// 	return products[0].productSnapshot.price;
		// }
		return this.baseCurrency$.value || CurrencyCodeEnum.USD;
	})

	public readonly amountToPay = computed(() => {
		const order = this.order();
		const {services, products} = order;
		const totalServices = services.reduce((acc, service) => acc + service.serviceSnapshot.durationVersions[0].prices[0].price, 0);
		const totalProducts = products.reduce((acc, product) => acc + product.productSnapshot.price.value, 0);
		return totalServices + totalProducts;
	});

	public readonly amountPaid = computed(() => {
		const payments = this.resource.value();
		return payments.reduce((acc, payment) => acc + payment.amount, 0);
	})

	public readonly resource: ResourceRef<EPayment[]> = resource({
		defaultValue: [],
		request: () => ({
			orderId: this.order()._id,
			page: this.page(),
		}),
		loader: async ({request: {orderId, page}}) => {

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
		const modal = await this.modalController.create({
			component: PaymentModalFormOrganism,
			componentProps: {
				payments: this.resource.value(),
				order: this.order(),
				currency: this.currency(),
			},
		});
		await modal.present();
	}


}
