import {CurrencyCodeEnum} from "@utility/domain/enum";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {ICustomer} from "@customer/domain";
import {IBaseEntity} from "@utility/domain";
import {Tools} from "@utility/tools";
import {Types} from "@utility/types";


export interface IPaymentDto extends IBaseEntity<'PaymentDto'> {
	providerPaymentRef: string | null;
	orderId: string;
	payer: ICustomer;
	amount: number & Types.Minimum<0>;
	currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
	method: PaymentMethodEnum & Types.Default<PaymentMethodEnum.CASH>;
	providerType?: PaymentProviderTypeEnum & Types.Default<PaymentProviderTypeEnum.onSite>;
	status: PaymentStatusEnum & Types.Default<PaymentStatusEnum.pending>;
	paymentDate?: string;
}


export const isPayment = Tools.createIs<IPaymentDto>();
export const validPayment = Tools.createValidate<IPaymentDto>();
export const randomPayment = Tools.createRandom<IPaymentDto>();
