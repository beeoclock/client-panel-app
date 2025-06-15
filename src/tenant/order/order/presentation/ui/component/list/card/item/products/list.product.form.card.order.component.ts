import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnChanges,
	ViewEncapsulation
} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@core/cdk/reactive";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {LanguageCodeEnum} from "@core/shared/enum";
import {AlertController} from "@ionic/angular/standalone";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderProductForm} from "@tenant/order/order/presentation/form/product.order.form";
import {IProduct} from "@tenant/product/product/domain";
import {
	ItemListProductFormOrder
} from "@shared/presentation/component/smart/order/form/product/list/item/item.list.product.form.order";

@Component({
	standalone: true,
	selector: 'app-list-product-form-card-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		ItemListProductFormOrder,
	],
	template: `
		<div class="flex-col justify-start items-start flex">
			<div class="bg-white flex-col justify-start items-start flex divide-y border border-gray-200 rounded-2xl">
				@for (item of selectedProductPlusControlList; track item._id; let index = $index) {
					@if (specificOrderServiceId() === null || specificOrderServiceId() === item._id) {
						<item-list-product-form-order
							[control]="item.control"
							[id]="idPrefix() + item._id"
							(deleteMe)="deleteOrderedProduct(item._id)"
							(saveChanges)="saveChanges(item.control)"/>
					}
				}
			</div>
		</div>
	`,
	host: {
		class: 'flex-col justify-start items-start flex'
	}
})
export class ListProductFormCardOrderComponent extends Reactive implements OnChanges {

	public readonly order = input.required<IOrder.DTO>();

	public readonly specificOrderServiceId = input<string | null>(null);

	public readonly idPrefix = input('');

	public readonly selectedProductPlusControlList: {
		_id: string;
		product: IProduct.DTO;
		control: OrderProductForm;
	}[] = [];

	@SelectSnapshot(BusinessProfileState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	readonly #ngxLogger = inject(NGXLogger);
	readonly #translateService = inject(TranslateService);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);
	readonly #alertController = inject(AlertController);

	public ngOnChanges() {
		this.selectedProductPlusControlList.length = 0;
		this.order().products.forEach((orderProductDto) => {
			if (orderProductDto.state === StateEnum.active) {
				this.selectedProductPlusControlList.push({
					_id: orderProductDto._id,
					product: orderProductDto.productSnapshot,
					control: OrderProductForm.create(orderProductDto),
				});
			}
		});
		this.#changeDetectorRef.detectChanges();
	}

	public async deleteOrderedProduct(orderedProductId: string) {

		this.#ngxLogger.info('deleteOrderedProduct', orderedProductId);

		const isLastProductInOrder = this.selectedProductPlusControlList.length === 1;
		const confirmed = await this.confirmToDelete(isLastProductInOrder);

		if (!confirmed) {
			return;
		}

		this.dispatchOrderedProductState(orderedProductId, StateEnum.deleted);
		this.#changeDetectorRef.detectChanges();

	}

	private async confirmToDelete(isLastProductInOrder = false) {
		this.#ngxLogger.info('confirmToDelete', isLastProductInOrder);

		const header = this.#translateService.instant('order.confirmation.delete.service.header');
		const message = this.#translateService.instant('order.confirmation.delete.service.message');
		let subHeader = '';
		let cssClass = '';

		if (isLastProductInOrder) {
			subHeader = this.#translateService.instant('order.confirmation.delete.service.subHeader.lastProduct');
			cssClass = '!text-red-600';
		}
		const modal = await this.#alertController.create({
			header,
			subHeader,
			message,
			buttons: [
				{
					text: this.#translateService.instant('keyword.capitalize.cancel'),
					role: 'cancel'
				},
				{
					cssClass,
					text: this.#translateService.instant('keyword.capitalize.delete'),
					role: 'confirm'
				}
			]
		});
		await modal.present();
		const {role} = await modal.onDidDismiss();
		return role === 'confirm';
	}

	protected saveChanges(control: OrderProductForm) {
		this.#ngxLogger.info('saveChanges', control.getRawValue());

		const orderProductDto = control.getRawValue();
		this.dispatchOrderChanges({
			...this.order(),
			products: this.order().products.map((service) => {
				if (service._id === orderProductDto._id) {
					return orderProductDto;
				}
				return service;
			})
		});
	}

	@Dispatch()
	protected dispatchOrderedProductState(orderedProductId: string, state: StateEnum) {
		return new OrderActions.OrderedProductState(
			this.order()._id,
			orderedProductId,
			state
		);
	}

	@Dispatch()
	protected dispatchOrderChanges(item: IOrder.DTO): OrderActions.UpdateItem {
		return new OrderActions.UpdateItem(item);
	}

}
