import {CurrencyCodeEnum} from "@core/shared/enum";
import {PaymentMethodEnum} from "../enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "../enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "../enum/payment.status.enum";
import {ICustomer} from "@tenant/customer/domain";
import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {Types} from "@core/shared/types";
import {AnchorTypeEnum} from "@tenant/payment/domain/enum/anchor.type.enum";


export namespace IPayment {

	export interface DTO extends IBaseDTO<'PaymentDto'> {

		providerPaymentRef: string | null;
		orderId: string;
		payer: ICustomer.EntityRaw;
		amount: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		method: PaymentMethodEnum & Types.Default<PaymentMethodEnum.CASH>;
		providerType?: PaymentProviderTypeEnum & Types.Default<PaymentProviderTypeEnum.onSite>;
		status: PaymentStatusEnum & Types.Default<PaymentStatusEnum.pending>;
		paymentDate?: string;
		anchorType: AnchorTypeEnum & Types.Default<AnchorTypeEnum.order>;

	}

	export type EntityRaw = IBaseEntityRaw<'PaymentDto'> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	};

}


export const isPayment = Tools.createIs<IPayment.DTO>();
export const validPayment = Tools.createValidate<IPayment.DTO>();
export const randomPayment = Tools.createRandom<IPayment.DTO>();
