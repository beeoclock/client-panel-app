import {CurrencyCodeEnum} from "@core/shared/enum";
import {PaymentMethodEnum} from "@tenant/order/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@tenant/order/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@tenant/order/payment/domain/enum/payment.status.enum";
import {BaseEntityForm} from "@shared/base.form";
import {FormControl} from "@angular/forms";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {AnchorTypeEnum} from "@tenant/order/payment/domain/enum/anchor.type.enum";

export interface IPaymentForm {
    providerPaymentRef: FormControl<string | null>;
    orderId: FormControl<string | null>;
    payer: CustomerForm;
    amount: FormControl<number>;
    currency: FormControl<CurrencyCodeEnum | null>;
    method: FormControl<PaymentMethodEnum>;
    providerType: FormControl<PaymentProviderTypeEnum>;
    status: FormControl<PaymentStatusEnum>;
    anchorType: FormControl<AnchorTypeEnum>;
    anchorId: FormControl<string | null>;
    paymentDate: FormControl<string>;
}

export type PaymentFormValue = ReturnType<PaymentForm['getRawValue']>;

export class PaymentForm extends BaseEntityForm<'PaymentDto', IPaymentForm> {

    constructor() {
        super('PaymentDto', {
            providerPaymentRef: new FormControl(),
            orderId: new FormControl(),
            payer: CustomerForm.create({
                customerType: CustomerTypeEnum.anonymous,
            }),
            amount: new FormControl<number>(0, {
                nonNullable: true,
            }),
            currency: new FormControl(),
            method: new FormControl(PaymentMethodEnum.CASH, {
                nonNullable: true,
            }),
            providerType: new FormControl(PaymentProviderTypeEnum.onSite, {
                nonNullable: true,
            }),
            status: new FormControl(PaymentStatusEnum.succeeded, {
                nonNullable: true,
            }),
            anchorType: new FormControl(AnchorTypeEnum.order, {
                nonNullable: true,
            }),
            anchorId: new FormControl(null),
            paymentDate: new FormControl(new Date().toISOString(), {
                nonNullable: true,
            }),
        });
    }

    public static create(initValue: Partial<PaymentFormValue> = {}): PaymentForm {

        const form = new PaymentForm();

        form.patchValue(initValue);

        return form;

    }

}
