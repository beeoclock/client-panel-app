import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	model,
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
	IonListHeader,
	IonModalToken,
	IonNote,
	IonText,
	IonTitle,
	IonToolbar
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {CurrencyPipe} from "@angular/common";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {PaymentForm} from "@tenant/order/payment/presentation/form/payment.form";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import {AnchorTypeEnum} from "@tenant/order/payment/domain/enum/anchor.type.enum";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {PaymentMethodEnum} from "@tenant/order/payment/domain/enum/payment.method.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {
	PaymentMethodIonSelectAtom
} from "@tenant/order/payment/presentation/ui/organism/form/payment-method.ion-select.atom";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {tap} from "rxjs";

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
		ReactiveFormsModule,
		PaymentMethodIonSelectAtom,
		IconComponent,
		IonListHeader,
		IonNote,

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
<!--			<div class="px-8 pt-4 pb-1 text-xs font-semibold text-neutral-400">-->
<!--				{{ 'keyword.capitalize.services' | translate }}-->
<!--			</div>-->
			<ion-list [inset]="false" class="!mt-0">
				<ion-list-header>
					<ion-label>
						{{ 'keyword.capitalize.services' | translate }}
					</ion-label>
				</ion-list-header>
				@for (service of notPaidServices(); track service._id) {
					<ion-item lines="full">
						@if (notPaidServices().length > 1) {
							<ion-checkbox [value]="service._id" [checked]="isServiceSelected(service._id)" (ionChange)="toggleService($event)" labelPlacement="end">
								{{ service.serviceSnapshot.languageVersions[0].title }}
							</ion-checkbox>
						} @else {
							{{ service.serviceSnapshot.languageVersions[0].title }}
						}
						<ion-text slot="end">
							{{ service.serviceSnapshot.durationVersions[0].prices[0].price | currency: currency() }}
						</ion-text>
					</ion-item>
				}
			</ion-list>
<!--			<div class="px-8 pb-1 text-xs font-semibold text-neutral-400">-->
<!--				{{ 'keyword.capitalize.products' | translate }}-->
<!--			</div>-->
			<ion-list [inset]="false" class="!mt-0">
				<ion-list-header>
					<ion-label>
						{{ 'keyword.capitalize.products' | translate }}
					</ion-label>
					<ion-button (click)="addProduct()">
						<app-icon class="text-3xl" slot="icon-only" name="ionAddOutline"/>
					</ion-button>
				</ion-list-header>
				@for (product of notPaidProducts(); track product._id) {
					<ion-item lines="full">
						<ion-checkbox [value]="product._id" [checked]="isProductSelected(product._id)" (ionChange)="toggleProduct($event)" labelPlacement="end">
							{{ product.productSnapshot.languageVersions[0].title }}
						</ion-checkbox>
						<ion-text slot="end">
							{{ (product.productSnapshot.price.value * product.quantity) | currency: currency() }}
						</ion-text>
					</ion-item>
				}
				@if (!notPaidProducts().length) {
					<ion-item lines="full">
						<ion-note>
							{{ 'payment.modal.checkout.noProducts.label' | translate }}
						</ion-note>
					</ion-item>
				}
<!--				<ion-item [button]="true" lines="full" [detail]="false" (click)="addProduct()" class="text-blue-600">-->
<!--					<ion-label>-->
<!--						{{ 'payment.modal.checkout.button.addProduct.label' | translate }}-->
<!--					</ion-label>-->
<!--					<app-icon name="ionAddCircleOutline"/>-->
<!--				</ion-item>-->
			</ion-list>
<!--			<div class="px-8 pb-1 text-xs font-semibold text-neutral-400">-->
<!--				{{ 'keyword.capitalize.summary' | translate }}-->
<!--			</div>-->
			<ion-list [inset]="false" class="!mt-0">
				<ion-list-header>
					<ion-label>
						{{ 'keyword.capitalize.summary' | translate }}
					</ion-label>
				</ion-list-header>
				<ion-item lines="full">
					<ion-label>
						{{ 'keyword.capitalize.amountToPay' | translate }}
					</ion-label>
					<ion-text slot="end">
						{{ amountToPay() | currency: currency() }}
					</ion-text>
				</ion-item>
				<ion-item lines="full">
					<gh-payment-method-ion-select-atom [control]="paymentMethodEnumFormControl"/>
				</ion-item>
			</ion-list>
		</ion-content>
		<ion-footer>
			<ion-toolbar class="!p-0">
				<ion-button [disabled]="!isSomethingSelected()" (click)="save()" expand="block">
					{{ 'keyword.capitalize.save' | translate }}
				</ion-button>
			</ion-toolbar>
		</ion-footer>
	`
})
export class PaymentModalFormOrganism {

	public readonly payments = input.required<EPayment[]>();
	public readonly order = model.required<EOrder>();
	public readonly currency = input.required<CurrencyCodeEnum>();
	public readonly selectedServiceIdList = input<string[]>([]);

	public readonly paymentMethodEnumFormControl = new FormControl<PaymentMethodEnum>(PaymentMethodEnum.CASH, {
		nonNullable: true,
	});

	private readonly ionModalElement = inject(IonModalToken);
	private readonly store = inject(Store);
	private readonly actions = inject(Actions);

	private readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			OrderActions.SetOrderedProduct,
			OrderActions.SetOrderedService,
		),
		tap((action) => {
			console.log({action})
			const order = this.order();
			const orderCopy = EOrder.fromRaw(order.toRaw());
			if (action instanceof OrderActions.SetOrderedProduct) {
				const {orderId} = action.payload.item;
				if (orderId !== orderCopy._id) return;
				orderCopy.setOrderedProduct(action.payload.item);
				this.order.set(orderCopy);
			}
			if (action instanceof OrderActions.SetOrderedService) {
				const {orderId} = action.payload.entity;
				if (orderId !== orderCopy._id) return;
				orderCopy.setOrderedService(action.payload.entity);
				this.order.set(orderCopy);
			}
		})
	).subscribe();

	public readonly selectedServices = signal<Set<string>>(new Set<string>());
	public readonly selectedProducts = signal<Set<string>>(new Set<string>());

	public readonly notPaidServices = computed(() => {
		const order = this.order();
		const payments = this.payments();
		if (!payments.length) return order.getServiceList();
		return order.getServiceList().filter((service) => {
			const isPaid = payments.some(payment => payment.anchorId === service._id && payment.anchorType === AnchorTypeEnum.service);
			return !isPaid;
		});
	});

	public readonly notPaidProducts = computed(() => {
		const payments = this.payments();
		const order = this.order();
		if (!payments.length) return order.getProductList();
		return order.getProductList().filter((product) => {
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
				return acc + (product.productSnapshot.price.value * product.quantity);
			}
			return acc;
		}, 0);

		return totalServices + totalProducts;
	});

	public constructor() {
		afterNextRender(() => {

			const selectedServiceIdList = this.selectedServiceIdList();

			// Initialize selected services
			const notPaidServices = this.notPaidServices();
			const setOfServices = new Set<string>(selectedServiceIdList);
			if (!setOfServices.size) {
				notPaidServices.forEach(service => {
					setOfServices.add(service._id);
				});
			}
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

	public addProduct() {
		const action = new OrderActions.AddProductModalForm({
			orderId: this.order()._id,
		});
		this.store.dispatch(action);
	}

	public async save() {
		const isSelectedFullOrder = this.isSelectedFullOrder();
		if (isSelectedFullOrder) {
			await this.saveFullOrder();
		} else {
			await this.saveSelectedItems();
		}
		await this.ionModalElement.dismiss();
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
				method: this.paymentMethodEnumFormControl.getRawValue(),
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
				amount: product.productSnapshot.price.value,
				method: this.paymentMethodEnumFormControl.getRawValue(),
				currency: this.currency(),
			});
			const action = new PaymentDataActions.CreateItem(form.getRawValue());
			this.store.dispatch(action);

		});

	}

	public async close() {
		await this.ionModalElement.dismiss();
	}

	public isServiceSelected(_id: string) {
		return this.selectedServices().has(_id);
	}

	public isProductSelected(_id: string) {
		return this.selectedProducts().has(_id);
	}
}
