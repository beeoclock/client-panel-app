import {PaymentForm} from "@tenant/payment/presentation/form/payment.form";
import {FormGroup} from "@angular/forms";
import {OrderForm} from "@tenant/order/presentation/form/order.form";
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

		this.controls.order.controls.services.valueChanges.pipe(
			takeUntilDestroyed(destroyRef)
		).subscribe((services) => {

			const amount = services.reduce((acc, service) => {
				const price = service.serviceSnapshot?.durationVersions?.[0].prices?.[0]?.price ?? 0;
				return acc + price;
			}, 0);
			this.controls.payment.controls.amount.patchValue(amount);

		});

	}

}
