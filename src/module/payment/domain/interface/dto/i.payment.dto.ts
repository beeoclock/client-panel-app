import {CurrencyCodeEnum} from "@utility/domain/enum";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {ICustomer} from "@customer/domain";
import typia, {tags} from "typia";
import {IBaseEntity} from "@utility/domain";


export interface IPaymentDto extends IBaseEntity<'PaymentDto'>{
    providerPaymentRef: string | null;
    orderId: string;
    payer: ICustomer;
    amount: number & tags.Minimum<0>;
    currency: CurrencyCodeEnum & tags.Default<CurrencyCodeEnum.USD>;
    method: PaymentMethodEnum & tags.Default<PaymentMethodEnum.CASH>;
    providerType?: PaymentProviderTypeEnum & tags.Default<PaymentProviderTypeEnum.local>;
    status: PaymentStatusEnum & tags.Default<PaymentStatusEnum.pending>;
    paymentDate?: string;
}


export const isPayment = typia.createIs<IPaymentDto>();
export const validPayment = typia.createValidate<IPaymentDto>();
export const randomPayment = typia.createRandom<IPaymentDto>();
