import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {FormGroup} from "@angular/forms";
import {OrderForm} from "@order/presentation/form/order.form";

export interface ICreateOrderForm {

    order: OrderForm;
    payment: PaymentForm;

}

export class CreateOrderForm extends FormGroup<ICreateOrderForm> {

    constructor() {

        super({

            order: new OrderForm(),
            payment: new PaymentForm(),

        });

    }

    public static create(initValue = {}): CreateOrderForm {

        const form = new CreateOrderForm();

        form.patchValue(initValue);

        return form;

    }

}
