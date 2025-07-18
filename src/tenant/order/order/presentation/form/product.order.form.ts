import {BaseEntityForm} from "@shared/base.form";
import {FormArray, FormControl} from "@angular/forms";
import {IMeta} from "@shared/domain";
import {IProduct} from "@tenant/product/product/domain";
import {IOrderProductDto} from "@tenant/order/order/domain/interface/i.order-product.dto";

export interface IOrderProductForm {

	quantity: FormControl<number>;
	orderServiceId: FormControl<string>;
	productSnapshot: FormControl<IProduct.DTO>;
	orderId: FormControl<string>;
	meta: FormControl<IMeta>;

}

export class OrderProductForm extends BaseEntityForm<'OrderProductDto', IOrderProductForm> {

	public constructor() {

		super('OrderProductDto', {

			quantity: new FormControl(),
			orderServiceId: new FormControl(),
			productSnapshot: new FormControl(),
			meta: new FormControl(),
			orderId: new FormControl(),

		});

	}

	public static create(initValue: Partial<IOrderProductDto> = {}): OrderProductForm {

		const form = new OrderProductForm();

		if (initValue) form.patchValue(initValue);

		return form;

	}

}

export class OrderProductFormArray extends FormArray<OrderProductForm> {

	public constructor() {
		super([]);
	}

	public pushNewOne(initialValue?: Partial<IOrderProductDto> | undefined): OrderProductForm {

		const control = new OrderProductForm();

		if (initialValue) {

			control.patchValue(initialValue);

		}
		this.push(control);

		this.updateValueAndValidity();

		return control;

	}

	public static create(initialValue: IOrderProductDto[] = []): OrderProductFormArray {
		const formArray = new OrderProductFormArray();
		initialValue.forEach((serviceOrderDto) => {
			const item = OrderProductForm.create(serviceOrderDto);
			formArray.push(item);
		});
		return formArray;
	}

}
