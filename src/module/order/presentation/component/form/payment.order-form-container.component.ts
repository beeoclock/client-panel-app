import {Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {PaymentForm} from "@module/payment/presentation/form/payment.form";
import {CurrencyPipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {PaymentStatusEnum} from "@src/core/business-logic/payment/enum/payment.status.enum";
import {PaymentMethodEnum} from "@src/core/business-logic/payment/enum/payment.method.enum";
import {CreateOrderForm} from "@order/presentation/form/create.order.form";
import {BASE_CURRENCY} from '@src/token';

@Component({
    selector: 'app-payment-order-form-container',
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        CardComponent,
        FormsModule,
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
                        {{ (amount() || paymentForm.controls.amount.value) | currency: paymentForm.controls.currency.value ?? 'USD': 'symbol-narrow' }}
                    </div>
                </li>
            </ul>

            <div>
                <label default for="order-form-inputs-payment-method">
                    {{ 'keyword.capitalize.paymentMethod' | translate }}
                </label>
                <ng-select
                        labelForId="order-form-inputs-payment-method"
                        bindLabel="label"
                        bindValue="value"
                        [formControl]="paymentForm.controls.method"
                        [items]="paymentMethodOptions"
                        [clearable]="false"/>
            </div>

            <div>
                <label default for="order-form-label-payment-status">
                    {{ 'keyword.capitalize.paymentStatus' | translate }}
                </label>
                <ng-select
                        id="order-form-inputs-payment-status"
                        labelForId=""
                        bindLabel="label"
                        bindValue="value"
                        [formControl]="paymentForm.controls.status"
                        [items]="paymentStatusOptions"
                        [clearable]="false"/>
            </div>

        </bee-card>

    `
})
export class PaymentOrderFormContainerComponent implements OnInit {

    public readonly form = input.required<CreateOrderForm>();

	public readonly amount = input(0);

    private readonly ngxLogger = inject(NGXLogger);
    private readonly translateService = inject(TranslateService);

    private readonly BASE_CURRENCY = inject(BASE_CURRENCY);

    public get paymentForm(): PaymentForm {
        return this.form().controls.payment;
    }

    public readonly paymentMethodOptions = [PaymentMethodEnum.CASH, PaymentMethodEnum.CARD].map((value) => {
        const labelTranslateKey = `payment.method.${value}.label`;
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
        this.BASE_CURRENCY.subscribe((currency) => {
            this.paymentForm.controls.currency.setValue(currency);
        });

    }

}
