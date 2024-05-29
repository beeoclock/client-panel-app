import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {
    NamesFormAttendantComponent
} from "@event/presentation/component/form/attendees/attendant/names.form.attendant.component";

@Component({
    selector: 'app-unregistered-payer-order-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
        NamesFormAttendantComponent,
        TranslateModule
    ],
    standalone: true,
    template: `

        <div class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
            <div class="font-bold">
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ 'keyword.capitalize.warning' | translate }}
            </div>
            <div>
                {{ 'order.form.payment.payer.case.unregistered.hint' | translate }}
            </div>
        </div>
        <app-event-names-form-attendant-component [form]="form.controls.payer"/>

    `
})
export class UnregisteredPayerOrderFormContainerComponent {

    @Input()
    public form!: PaymentForm;

    @HostBinding()
    public readonly class = 'flex flex-col gap-2'

}
