import {CurrencyCodeEnum} from "@utility/domain/enum";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "@module/payment/domain/enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "@module/payment/domain/enum/payment.status.enum";
import {ICustomer} from "@customer/domain";
import {IBaseEntity} from "@utility/domain";
import {Tools} from "@utility/tools";
import {Types} from "@utility/types";
import IBaseItem from "@src/core/interface/i.base-item";


export namespace IPayment {

	export interface DTO extends IBaseEntity<'PaymentDto'> {

		providerPaymentRef: string | null;
		orderId: string;
		payer: ICustomer.Entity;
		amount: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		method: PaymentMethodEnum & Types.Default<PaymentMethodEnum.CASH>;
		providerType?: PaymentProviderTypeEnum & Types.Default<PaymentProviderTypeEnum.onSite>;
		status: PaymentStatusEnum & Types.Default<PaymentStatusEnum.pending>;
		paymentDate?: string;

	}

	export interface Entity extends IBaseItem<'PaymentDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	}

}


export const isPayment = Tools.createIs<IPayment.DTO>();
export const validPayment = Tools.createValidate<IPayment.DTO>();
export const randomPayment = Tools.createRandom<IPayment.DTO>();
