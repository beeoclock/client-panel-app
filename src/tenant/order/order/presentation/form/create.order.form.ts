import {PaymentForm} from "@tenant/order/payment/presentation/form/payment.form";
import {FormGroup} from "@angular/forms";
import {OrderForm} from "@tenant/order/order/presentation/form/order.form";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DestroyRef} from "@angular/core";

export interface ICreateOrderForm {

	order: OrderForm;
	payment: PaymentForm;

}

export class CreateOrderForm extends FormGroup<ICreateOrderForm> {

	constructor(
		public readonly destroyRef: DestroyRef,
	) {

		super({

			order: new OrderForm(),
			payment: new PaymentForm(),

		});

		this.initHandlers(destroyRef);

	}

	public static create(destroyRef: DestroyRef, initValue = {}): CreateOrderForm {

		const form = new CreateOrderForm(destroyRef);

		form.patchValue(initValue);

		return form;

	}

	public initHandlers(destroyRef: DestroyRef): void {

		this.initHandlersForAmount(destroyRef);

	}

	public initHandlersForAmount(destroyRef: DestroyRef): void {

		this.controls.order.valueChanges.pipe(
			takeUntilDestroyed(destroyRef)
		).subscribe(({services, products}) => {

			let amount = 0;

			if (products) {
				amount += products.reduce((acc, product) => {
					const price = product.productSnapshot?.price?.value ?? 0;
					return acc + price * (product.quantity ?? 1);
				}, 0);
			}

			if (services) {

				amount += services.reduce((acc, service) => {
					const price = service.serviceSnapshot?.durationVersions?.[0].prices?.[0]?.price ?? 0;
					return acc + price;
				}, 0);
			}
			this.controls.payment.controls.amount.patchValue(amount);

		});

	}

}
