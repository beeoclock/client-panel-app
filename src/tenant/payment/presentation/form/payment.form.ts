import {CurrencyCodeEnum} from "@core/shared/enum";
import {PaymentMethodEnum} from "@tenant/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@tenant/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@tenant/payment/domain/enum/payment.status.enum";
import {BaseEntityForm} from "@utility/base.form";
import {FormControl} from "@angular/forms";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";

export interface IPaymentForm {
    providerPaymentRef: FormControl<string | null>;
    orderId: FormControl<string | null>;
    payer: CustomerForm;
    amount: FormControl<number>;
    currency: FormControl<CurrencyCodeEnum | null>;
    method: FormControl<PaymentMethodEnum>;
    providerType: FormControl<PaymentProviderTypeEnum>;
    status: FormControl<PaymentStatusEnum>;
    paymentDate: FormControl<string>;
}

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
            paymentDate: new FormControl(new Date().toISOString(), {
                nonNullable: true,
            }),
        });
    }

    public static create(initValue: Partial<IPayment.DTO> = {}): PaymentForm {

        const form = new PaymentForm();

        form.patchValue(initValue);

        return form;

    }

}
