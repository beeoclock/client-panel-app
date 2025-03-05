import {Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {PaymentForm} from "@payment/presentation/form/payment.form";
import {CurrencyPipe} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {PaymentStatusEnum} from "@core/business-logic/payment/enum/payment.status.enum";
import {PaymentMethodEnum} from "@core/business-logic/payment/enum/payment.method.enum";
import {CreateOrderForm} from "@order/presentation/form/create.order.form";
import {BASE_CURRENCY} from '@src/token';
import {IonicModule} from "@ionic/angular";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";

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
		IonicModule,
		SwitchComponent
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

<!--			<div>-->

<!--				<ion-segment [formControl]="paymentForm.controls.method">-->

<!--					@for (option of paymentMethodOptions; track option.value) {-->

<!--						<ion-segment-button id="order-form-inputs-payment-method" [value]="option.value">-->
<!--							<ion-label>-->
<!--								{{ option.label }}-->
<!--							</ion-label>-->
<!--						</ion-segment-button>-->

<!--					}-->

<!--				</ion-segment>-->

<!--			</div>-->

			<div>
				<utility-switch-component
					id="order-form-inputs-payment-status"
					labelTranslateKey="keyword.capitalize.paid"
					[units]="paymentStatusUnits"
					[control]="paymentForm.controls.status"/>
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
	});

	public readonly paymentStatusUnits = [PaymentStatusEnum.pending, PaymentStatusEnum.succeeded];

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
	});

	public ngOnInit(): void {

		this.ngxLogger.info('PaymentOrderFormContainerComponent initialized');
		this.BASE_CURRENCY.subscribe((currency) => {
			this.paymentForm.controls.currency.setValue(currency);
		});

	}

}
