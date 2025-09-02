import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {
	ProductPopoverChip
} from "@shared/presentation/ui/component/smart/order/form/product/list/item/chip/product/product-popover.chip";
import {IProduct} from "@tenant/product/product/domain";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {TranslatePipe} from "@ngx-translate/core";
import {OrderProductFormArray} from "@tenant/order/order/presentation/form/product.order.form";
import {IOrderProductDto} from "@tenant/order/order/domain/interface/i.order-product.dto";
import {
	ItemListProductFormOrder
} from "@shared/presentation/ui/component/smart/order/form/product/list/item/item.list.product.form.order";

@Component({
	selector: 'product-list-form-order',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="h-12 px-4 py-2 bg-neutral-50 border-slate-400 justify-start items-center gap-2 flex w-full">
			<div class="text-neutral-700 text-base font-bold w-full">
				{{ 'keyword.capitalize.products' | translate }}
			</div>
			<button id="product-popover-chip-form-order-component-add-product" primaryLink
					class="w-8 rounded-lg justify-center items-center flex !py-0">
				<i class="bi bi-plus-circle text-2xl"></i>
			</button>
			<product-popover-chip
				class="absolute"
				trigger="product-popover-chip-form-order-component-add-product"
				(result)="addProduct($event)"/>
		</div>
		<div class="flex-col justify-start items-start flex w-full px-1">
			<div class="bg-white flex-col justify-start items-start flex divide-y border border-gray-200 rounded-2xl w-full">
				@for (control of orderProductFormArray().controls; track $index;) {
					<item-list-product-form-order [control]="control" (deleteMe)="delete($index)"/>
				}
			</div>
		</div>
	`,
	imports: [
		ProductPopoverChip,
		PrimaryLinkButtonDirective,
		TranslatePipe,
		ItemListProductFormOrder
	],
	host: {
		class: 'flex-col justify-start items-start flex'
	}
})
export class ListProductFormOrder {

	public readonly orderProductFormArray = input.required<OrderProductFormArray>();

	public delete(index: number) {
		this.orderProductFormArray().removeAt(index);
	}

	public addProduct(item: IProduct.DTO) {
		const orderProductForm = this.convertProductToOrderProductForm(item);
		this.orderProductFormArray().pushNewOne(orderProductForm);
	}

	private convertProductToOrderProductForm(product: IProduct.DTO): Partial<IOrderProductDto> {
		return {
			quantity: 1,
			productSnapshot: product,
		};
	}

}
