import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {PaymentMethodEnum} from "@tenant/order/payment/domain/enum/payment.method.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'gh-payment-method-ion-select-atom',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block w-full'
	},
	template: `
		<ion-select interface="popover" [formControl]="control()"
					[label]="'payment.form.method.label' | translate" [placeholder]="">
			<ion-select-option [value]="paymentMethodEnum.CARD">
				{{ 'payment.method.CARD.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.CASH">
				{{ 'payment.method.CASH.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.DEBIT_CARD">
				{{ 'payment.method.DEBIT_CARD.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.BANK_TRANSFER">
				{{ 'payment.method.BANK_TRANSFER.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.PAYPAL">
				{{ 'payment.method.PAYPAL.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.APPLE_PAY">
				{{ 'payment.method.APPLE_PAY.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.GOOGLE_PAY">
				{{ 'payment.method.GOOGLE_PAY.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.CRYPTO">
				{{ 'payment.method.CRYPTO.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.INVOICE">
				{{ 'payment.method.INVOICE.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.CHECK">
				{{ 'payment.method.CHECK.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.MOBILE_PAYMENT">
				{{ 'payment.method.MOBILE_PAYMENT.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.GIFT_CARD">
				{{ 'payment.method.GIFT_CARD.label' | translate }}
			</ion-select-option>
			<ion-select-option [value]="paymentMethodEnum.OTHER">
				{{ 'payment.method.OTHER.label' | translate }}
			</ion-select-option>
		</ion-select>
	`,
	imports: [
		IonSelect,
		IonSelectOption,
		TranslatePipe,
		ReactiveFormsModule
	]
})
export class PaymentMethodIonSelectAtom {
	public readonly control = input.required<FormControl<PaymentMethodEnum>>();
	protected readonly paymentMethodEnum = PaymentMethodEnum;
}
