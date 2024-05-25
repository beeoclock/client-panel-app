import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
    FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {
    ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {NGXLogger} from "ngx-logger";
import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {CurrencyPipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";

@Component({
    selector: 'app-payment-order-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormInputComponent,
        DatetimeLocalInputComponent,
        TranslateModule,
        FormTextareaComponent,
        CardComponent,
        FormBusinessProfileComponent,
        SwitchComponent,
        ButtonSaveContainerComponent,
        FormsModule,
        PrimaryButtonDirective,
        CurrencyPipe,
        NgSelectModule,
        ReactiveFormsModule,
        DefaultLabelDirective
    ],
    standalone: true,
    template: `

        <bee-card>

            <div class="font-bold">{{ 'keyword.capitalize.payment' | translate }}</div>

            <ul>
                <li class="flex justify-between">
                    <div>
                        {{ 'keyword.capitalize.amount' | translate }}:
                    </div>
                    <div>
                        {{ form.controls.amount.value | currency: form.controls.currency.value ?? 'USD' }}
                    </div>
                </li>
            </ul>

            <div>
                <label default for="order-form-inputs-payment-provider-type">
                    {{ 'keyword.capitalize.paymentMethod' | translate }}
                </label>
                <ng-select
                        labelForId="order-form-inputs-payment-provider-type"
                        bindLabel="label"
                        bindValue="value"
                        [formControl]="form.controls.providerType"
                        [items]="paymentProviderTypeOptions"
                        [clearable]="false"/>
            </div>

            <div>
                <label default for="order-form-label-payment-provider-type">
                    {{ 'keyword.capitalize.paymentStatus' | translate }}
                </label>
                <ng-select
                        id="order-form-inputs-provider-type"
                        labelForId=""
                        bindLabel="label"
                        bindValue="value"
                        [formControl]="form.controls.status"
                        [items]="paymentStatusOptions"
                        [clearable]="false"/>
            </div>

        </bee-card>

    `
})
export class PaymentOrderFormContainerComponent implements OnInit {

    @Input()
    public form!: PaymentForm;

    private readonly ngxLogger = inject(NGXLogger);
    private readonly translateService = inject(TranslateService);

    public readonly paymentProviderTypeOptions = Object.values(PaymentProviderTypeEnum).map((value) => {
        const labelTranslateKey = `payment.providerType.${value}.label`;
        let label = this.translateService.instant(labelTranslateKey);
        if (label === labelTranslateKey) {
            label = value;
        }
        return {
            value,
            label,
        };
    })

    public readonly paymentStatusOptions = Object.values(PaymentStatusEnum).map((value) => {
        const labelTranslateKey = `payment.status.${value}.label`;
        let label = this.translateService.instant(labelTranslateKey);
        if (label === labelTranslateKey) {
            label = value;
        }
        return {
            value,
            label,
        };
    })

    public ngOnInit(): void {

        this.ngxLogger.info('PaymentOrderFormContainerComponent initialized');

    }

}
