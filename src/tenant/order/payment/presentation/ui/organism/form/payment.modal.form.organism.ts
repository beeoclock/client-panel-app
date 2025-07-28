import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	signal,
	ViewEncapsulation
} from "@angular/core";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {
	IonButton,
	IonButtons,
	IonCheckbox,
	IonContent,
	IonFooter,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonText,
	IonTitle,
	IonToolbar,
	ModalController
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {CurrencyPipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {PaymentForm} from "@tenant/order/payment/presentation/form/payment.form";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import {AnchorTypeEnum} from "@tenant/order/payment/domain/enum/anchor.type.enum";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'payment-modal-form-organism',
	imports: [
		IonHeader,
		IonToolbar,
		IonTitle,
		IonList,
		IonContent,
		IonItem,
		IonCheckbox,
		IonFooter,
		IonButton,
		IonButtons,
		TranslatePipe,
		IonLabel,
		IonText,
		CurrencyPipe,

	],
	template: `
		<ion-header>
			<ion-toolbar>
				<ion-title>{{ 'keyword.capitalize.payment' | translate }}</ion-title>
				<ion-buttons slot="end">
					<ion-button (click)="close()">
						{{ 'keyword.capitalize.close' | translate }}
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content color="light">
			<div class="px-8 pt-4 pb-1 text-xs font-semibold text-neutral-600">
				{{ 'keyword.capitalize.services' | translate }}
			</div>
			<ion-list [inset]="true" class="!mt-0">
				@for (service of notPaidServices(); track service._id) {
					<ion-item>
						<ion-checkbox [value]="service._id" [checked]="isServiceSelected(service._id)" (ionChange)="toggleService($event)" labelPlacement="end">
							{{ service.serviceSnapshot.languageVersions[0].title }}
						</ion-checkbox>
						<ion-text slot="end">
							{{ service.serviceSnapshot.durationVersions[0].prices[0].price | currency: currency() }}
						</ion-text>
					</ion-item>
				}
<!--				@for (product of notPaidProducts(); track product._id) {-->
<!--					<ion-item>-->
<!--						<ion-checkbox slot="start" aria-label="Toggle task completion">-->
<!--							{{ product.productSnapshot.name }}-->
<!--						</ion-checkbox>-->
<!--					</ion-item>-->
<!--				}-->
			</ion-list>
			<ion-list [inset]="true">
				<ion-item>
					<ion-label>
						{{ 'keyword.capitalize.amountToPay' | translate }}
					</ion-label>
					<ion-text slot="end">
						{{ amountToPay() | currency: currency() }}
					</ion-text>
				</ion-item>
			</ion-list>
		</ion-content>
		<ion-footer>
			<ion-toolbar>
				<ion-button [disabled]="!isSomethingSelected()" (click)="save()" expand="block">
					{{ 'keyword.capitalize.save' | translate }}
				</ion-button>
			</ion-toolbar>
		</ion-footer>
	`
})
export class PaymentModalFormOrganism {

	public readonly payments = input.required<EPayment[]>();
	public readonly order = input.required<EOrder>();
	public readonly currency = input.required<CurrencyCodeEnum>();

	private readonly modalController = inject(ModalController);
	private readonly store = inject(Store);

	public readonly selectedServices = signal<Set<string>>(new Set<string>());
	public readonly selectedProducts = signal<Set<string>>(new Set<string>());

	public readonly notPaidServices = computed(() => {
		const order = this.order();
		const payments = this.payments();
		return order.services.filter((service) => {
			const isPaid = payments.some(payment => payment.anchorId === service._id && payment.anchorType === AnchorTypeEnum.service);
			return !isPaid;
		});
	});

	public readonly notPaidProducts = computed(() => {
		const order = this.order();
		const payments = this.payments();
		return order.products.filter((product) => {
			const isPaid = payments.some(payment => payment.anchorId === product._id && payment.anchorType === AnchorTypeEnum.product);
			return !isPaid;
		});
	});

	public readonly isSelectedFullOrder = computed(() => {
		const order = this.order();
		const selectedServices = this.selectedServices();
		const selectedProducts = this.selectedProducts();
		const allServicesSelected = order.services.every(service => selectedServices.has(service._id));
		const allProductsSelected = order.products.every(product => selectedProducts.has(product._id));
		return allServicesSelected && allProductsSelected;
	});

	public readonly isSomethingSelected = computed(() => {
		const selectedServices = this.selectedServices();
		const selectedProducts = this.selectedProducts();
		return selectedServices.size > 0 || selectedProducts.size > 0;
	});

	public readonly amountToPay = computed(() => {
		const selectedServices = this.selectedServices();
		const selectedProducts = this.selectedProducts();

		const totalServices = Array.from(selectedServices).reduce((acc, serviceId) => {
			const service = this.order().services.find(({_id}) => _id === serviceId);
			if (service) {
				return acc + service.serviceSnapshot.durationVersions[0].prices[0].price;
			}
			return acc;
		}, 0);

		const totalProducts = Array.from(selectedProducts).reduce((acc, productId) => {
			const product = this.order().products.find(({_id}) => _id === productId);
			if (product) {
				return acc + product.productSnapshot.price;
			}
			return acc;
		}, 0);

		return totalServices + totalProducts;
	});

	public constructor() {
		afterNextRender(() => {

			// Initialize selected services
			const notPaidServices = this.notPaidServices();
			const setOfServices = new Set<string>();
			notPaidServices.forEach(service => {
				setOfServices.add(service._id);
			});
			this.selectedServices.set(setOfServices);

			// Initialize selected products
			const notPaidProducts = this.notPaidProducts();
			const setOfProducts = new Set<string>();
			notPaidProducts.forEach(product => {
				setOfProducts.add(product._id);
			});
			this.selectedProducts.set(setOfProducts);

		})
	}

	public async save() {
		const isSelectedFullOrder = this.isSelectedFullOrder();
		if (isSelectedFullOrder) {
			await this.saveFullOrder();
		} else {
			await this.saveSelectedItems();
		}
		await this.modalController.dismiss();
	}

	public toggleService($event: CustomEvent) {
		const {checked, value} = $event.detail;
		this.selectedServices.update(services => {
			const updated = new Set(services);
			if (checked) {
				updated.add(value);
			} else {
				updated.delete(value);
			}
			return updated;
		})
	}

	public toggleProduct($event: CustomEvent) {
		const {checked, value} = $event.detail;
		this.selectedProducts.update(products => {
			const updated = new Set(products);
			if (checked) {
				updated.add(value);
			} else {
				updated.delete(value);
			}
			return updated;
		})
	}

	private async saveFullOrder() {
		const order = this.order();
		const form = PaymentForm.create({
			orderId: order._id,
			anchorId: order._id,
			amount: this.amountToPay(),
			currency: this.currency(),
		});
		const action = new PaymentDataActions.CreateItem(form.getRawValue());
		this.store.dispatch(action);
	}

	private async saveSelectedItems() {

		const selectedServices = this.selectedServices();
		const selectedProducts = this.selectedProducts();
		const order = this.order();

		const selectedServiceList = order.services.filter(service => selectedServices.has(service._id));
		const selectedProductList = order.products.filter(product => selectedProducts.has(product._id));

		selectedServiceList.forEach((service)=> {

			const form = PaymentForm.create({
				orderId: order._id,
				anchorId: service._id,
				anchorType: AnchorTypeEnum.service,
				amount: service.serviceSnapshot.durationVersions[0].prices[0].price,
				currency: this.currency(),
			});
			const action = new PaymentDataActions.CreateItem(form.getRawValue());
			this.store.dispatch(action);

		});

		selectedProductList.forEach((product)=> {

			const form = PaymentForm.create({
				orderId: order._id,
				anchorId: product._id,
				anchorType: AnchorTypeEnum.product,
				amount: product.productSnapshot.price,
				currency: this.currency(),
			});
			const action = new PaymentDataActions.CreateItem(form.getRawValue());
			this.store.dispatch(action);

		});

	}

	public async close() {
		await this.modalController.dismiss();
	}

	public isServiceSelected(_id: string) {
		return this.selectedServices().has(_id);
	}
}
