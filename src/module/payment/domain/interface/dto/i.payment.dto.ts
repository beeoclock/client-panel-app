import {CurrencyCodeEnum} from "@utility/domain/enum";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {ICustomer} from "@customer/domain";


export interface PaymentDto {
    object: 'PaymentDto';
    _id: string;
    providerPaymentRef?: string;
    orderId: string;
    payer?: ICustomer;
    amount: number;
    currency: CurrencyCodeEnum;
    method: PaymentMethodEnum;
    providerType?: PaymentProviderTypeEnum;
    status: PaymentStatusEnum;
    paymentDate?: string;
    createdAt: string;
    updatedAt: string;
}
