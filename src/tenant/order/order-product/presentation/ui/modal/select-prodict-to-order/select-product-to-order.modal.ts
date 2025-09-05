import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	signal,
	ViewEncapsulation,
	WritableSignal
} from "@angular/core";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {
	IonButton,
	IonButtons,
	IonCheckbox,
	IonContent,
	IonFooter,
	IonHeader,
	IonInput,
	IonItem,
	IonLabel,
	IonModalToken,
	IonTitle,
	IonToolbar,
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {
	CardIonListSmartComponent
} from "@shared/presentation/ui/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	ProductTableNgxDatatableSmartResource
} from "@tenant/product/product/presentation/ui/page/list/product.table-ngx-datatable.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {SHARED_UOW_REF} from "@src/token";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CurrencyPipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {OrderProductForm} from "@tenant/order/order/presentation/form/product.order.form";

type FormGroupType = {
	quantity: FormControl<number>;
	product: FormControl<EProduct>;
}

@Component({
	selector: 'select-product-to-order-modal',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonButton,
		IonButtons,
		IonContent,
		IonHeader,
		IonTitle,
		IonToolbar,
		TranslatePipe,
		IonFooter,
		CardIonListSmartComponent,
		IonItem,
		IonCheckbox,
		IonLabel,
		IconComponent,
		IonInput,
		ReactiveFormsModule,
		CurrencyPipe,
	],
	providers: [
		{
			provide: SharedUow,
			useFactory: (SHARED_UOW_REF: WritableSignal<SharedUow | null>) => {
				const instance = SHARED_UOW_REF();
				return instance;
			},
			deps: [SHARED_UOW_REF]
		},
		{
			provide: TableNgxDatatableSmartResource,
			useClass: ProductTableNgxDatatableSmartResource,
		},
	],
	template: `
		<ion-header>
			<ion-toolbar>
				<ion-title>
					{{ 'keyword.capitalize.products' | translate }}
				</ion-title>
				<ion-buttons slot="end">
					<ion-button (click)="close()">
						{{ 'keyword.capitalize.close' | translate }}
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<ion-content color="light">
			<card-ion-list-smart-component [itemTemplate]="itemTemplate">

				<ng-template #itemTemplate let-item="item">
					@let product = asProduct(item);
					<ion-item lines="full">
						<ion-checkbox slot="start" (ionChange)="select(product)" aria-label="Toggle task completion"></ion-checkbox>
						<ion-label>
							{{ product.languageVersions[0].title }}
						</ion-label>
						@let form = selectedProductFormGroupMap().get(product._id);
						@if (form) {
							@let control = form.controls.quantity;
							<div slot="end" class="flex items-center">
								<ion-button [disabled]="control.getRawValue() < 2" shape="round" fill="outline" size="default" (click)="decrementQuantity(product)">
									<app-icon name="ionRemoveOutline" slot="icon-only"></app-icon>
								</ion-button>
								<ion-input
									class="max-w-8 border-0 text-center"
									[formControl]="control"
									type="number"/>
								<ion-button [disabled]="false" shape="round" fill="outline" size="default" (click)="incrementQuantity(product)">
									<app-icon name="ionAddOutline" slot="icon-only"></app-icon>
								</ion-button>
							</div>
						}
					</ion-item>
				</ng-template>

			</card-ion-list-smart-component>

		</ion-content>
		<ion-footer>
			<ion-toolbar class="!p-0">
				<ion-button [disabled]="!isSomethingSelected()" (click)="save()" expand="block">
					{{ total() | currency: undefined:'symbol':'1.2-2' }}
					•
					{{ 'keyword.capitalize.save' | translate }}
				</ion-button>
			</ion-toolbar>
		</ion-footer>
	`
})
export class SelectProductToOrderModal {

	public readonly order = input.required<EOrder>();

	private readonly ionModalToken = inject(IonModalToken);
	private readonly store = inject(Store);

	public readonly selectedProductFormGroupMap = signal<Map<string, FormGroup<FormGroupType>>>(new Map<string, FormGroup<FormGroupType>>());

	public readonly isSomethingSelected = signal(false);

	public readonly total = signal(0);

	public isSelected(item: EProduct): boolean {
		const selectedProducts = this.selectedProductFormGroupMap();
		return selectedProducts.has(item._id);
	}

	public select(item: EProduct) {
		this.selectedProductFormGroupMap.update(map => {
			if (map.has(item._id)) {
				map.delete(item._id);
				this.total.set(this.total() - item.price.value);
			} else {
				const formGroup = new FormGroup<FormGroupType>({
					quantity: new FormControl<number>(1, {
						nonNullable: true,
					}),
					product: new FormControl<EProduct>(item, {
						nonNullable: true,
					}),
				});
				map.set(item._id, formGroup);
				this.total.set(this.total() + item.price.value);
			}
			this.isSomethingSelected.set(map.size > 0);
			return map;
		});
	}

	public decrementQuantity(item: EProduct) {
		this.selectedProductFormGroupMap.update(map => {
			const formGroup = map.get(item._id);
			if (formGroup) {
				const currentQuantity = formGroup.controls.quantity.getRawValue();
				if (currentQuantity > 1) {
					const newQuantity = currentQuantity - 1;
					formGroup.controls.quantity.setValue(newQuantity);
					this.total.set(this.total() - item.price.value);
				}
			}
			return map;
		});
	}

	public incrementQuantity(item: EProduct) {
		this.selectedProductFormGroupMap.update(map => {
			const formGroup = map.get(item._id);
			if (formGroup) {
				const currentQuantity = formGroup.controls.quantity.getRawValue();
				const newQuantity = currentQuantity + 1;
				formGroup.controls.quantity.setValue(newQuantity);
				this.total.set(this.total() + item.price.value);
			}
			return map;
		});
	}

	public asProduct(item: any): EProduct {
		return item as EProduct;
	}

	public async save() {
		const actions: OrderActions.SetOrderedProduct[] = [];
		const selectedProductFormGroupMap = this.selectedProductFormGroupMap();
		const selectedProducts = Array.from(selectedProductFormGroupMap.entries());
		selectedProducts.forEach(({1: formGroup}) => {
			const {quantity, product} = formGroup.getRawValue();
			const orderedProductForm = OrderProductForm.create({
				quantity: quantity,
				productSnapshot: product,
				orderId: this.order()._id,
			});
			const action = new OrderActions.SetOrderedProduct({
				item: orderedProductForm.getRawValue()
			});
			actions.push(action);
		});
		this.store.dispatch(actions);
		await this.ionModalToken.dismiss();
	}

	public async close() {
		await this.ionModalToken.dismiss();
	}

}
