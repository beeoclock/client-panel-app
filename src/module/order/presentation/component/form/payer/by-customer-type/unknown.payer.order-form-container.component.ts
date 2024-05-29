import {Component, Input, ViewEncapsulation} from '@angular/core';
import {PaymentForm} from "@module/payment/presentation/form/payment.form";

@Component({
    selector: 'app-unknown-payer-order-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
    ],
    standalone: true,
    template: `

    `
})
export class UnknownPayerOrderFormContainerComponent {

    @Input()
    public form!: PaymentForm;

}
