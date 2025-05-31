import {ChangeDetectionStrategy, Component, inject, input, output, ViewEncapsulation} from "@angular/core";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {OrderProductForm} from "@tenant/order/order/presentation/form/product.order.form";
import {
	PriceChipComponent
} from "@shared/presentation/component/smart/order/form/service/list/item/chip/price.chip.component";
import ObjectID from "bson-objectid";
import {NGXLogger} from "ngx-logger";
import {
	QuantityChip
} from "@shared/presentation/component/smart/order/form/product/list/item/chip/quantity/quantity.chip";

@Component({
	selector: 'item-list-product-form-order',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let orderProduct = control()?.value ;
		@let product = orderProduct?.productSnapshot ;
		<div class="justify-between items-start gap-1 flex w-full">
			<div class="justify-start items-start gap-2 flex flex-wrap">
				<quantity-chip
					[id]="id()"
					(quantityChanges)="handleQuantityChanges($event)"
					[initialValue]="orderProduct?.quantity ?? 0"/>
				<app-price-chip-component
					[id]="id()"
					(priceChanges)="handlePriceChanges($event)"
					[initialValue]="product?.price?.value ?? 0"
					[currency]="product?.price?.currency"/>
			</div>
			<button primaryLink (click)="deleteMe.emit()"
					class="w-8 h-8 p-1.5 rounded-lg justify-center items-center flex">
				<i class="bi bi-dash-circle text-2xl"></i>
			</button>
		</div>
		<div class="justify-start items-start flex">
			<div class="justify-start gap-1.5 flex flex-1 w-full">
				@if ((product?.images ?? []).length) {
					<div class="sm:gap-4 flex flex-wrap">
						@for (image of product?.images; track image._id) {
							<div>
								<div class="rounded-2xl bg-beeColor-400">
									@if (image) {
										<img
											[src]="image.url"
											class="max-w-20 object-cover aspect-1 rounded-2xl"
											alt="Uploaded Image"/>
									}
								</div>
							</div>
						}
					</div>
				}

				<div class="flex flex-col divide-y w-full rounded-lg border text-sm">
					@for (languageVersion of product?.languageVersions; track languageVersion.language) {

						<div
							class="relative text-wrap flex gap-2 items-start p-2 font-sans text-neutral-900">
							<label
								class="relative font-bold uppercase flex items-center justify-center p-0 cursor-pointer border-2 border-neutral-200 px-1 rounded-lg">
								{{ languageVersion.language }}
							</label>
							<div class="flex flex-col gap-1">
								<div class="font-bold">{{ languageVersion.title }}</div>
								<div>{{ languageVersion.description }}</div>
							</div>
						</div>

					}
				</div>
			</div>
		</div>

	`,
	imports: [
		PrimaryLinkButtonDirective,
		PriceChipComponent,
		QuantityChip
	],
	host: {
		class: 'flex-col justify-start items-start p-3 gap-2 flex w-full'
	}
})
export class ItemListProductFormOrder {

	public readonly id = input<string>(ObjectID().toHexString());
	public readonly saveChanges = output<void>();
	public readonly control = input.required<OrderProductForm>();

	public readonly deleteMe = output<void>();

	private readonly ngxLogger = inject(NGXLogger);

	public handlePriceChanges(price: number) {
		const {productSnapshot} = this.control().getRawValue();
		// Check if the price is the same as the previous price, if so, return early

		if (productSnapshot.price.value === price) return;
		this.ngxLogger.debug('handlePriceChanges', this.id(), price);

		const productSnapshotCopy = structuredClone(productSnapshot);
		productSnapshotCopy.price.value = price;
		this.control().controls.productSnapshot.patchValue(productSnapshotCopy);
		this.saveChanges.emit();
	}

	public handleQuantityChanges(quantity: number) {
		const orderProduct = this.control().getRawValue();
		// Check if the price is the same as the previous price, if so, return early

		if (orderProduct.quantity === quantity) return;

		const orderProductCopy = structuredClone(orderProduct);
		orderProductCopy.quantity = quantity;
		this.control().patchValue(orderProductCopy);
		this.saveChanges.emit();
	}

}
