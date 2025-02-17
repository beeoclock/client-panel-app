import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPayment} from "../interface/i.payment";
import {ICustomer} from "../../customer";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {Types} from "@core/shared/types";
import {PaymentMethodEnum} from "../enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "../enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "../enum/payment.status.enum";

export class EPayment extends ABaseEntity<'PaymentDto', IPayment.DTO> implements IPayment.Entity {

	providerPaymentRef!: string | null;
	orderId!: string;
	payer!: ICustomer.Entity;
	amount!: number & Types.Minimum<0>;
	currency!: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
	method!: PaymentMethodEnum & Types.Default<PaymentMethodEnum.CASH>;
	providerType?: (PaymentProviderTypeEnum & Types.Default<PaymentProviderTypeEnum.onSite>) | undefined;
	status!: PaymentStatusEnum & Types.Default<PaymentStatusEnum.pending>;
	paymentDate?: string | undefined;


	public override toDTO(): IPayment.DTO {
		return EPayment.toDTO(this);
	}

	public static toDTO(data: IPayment.Entity): IPayment.DTO {
		return {
			_id: data._id,
			amount: data.amount,
			createdAt: data.createdAt,
			currency: data.currency,
			method: data.method,
			object: data.object,
			orderId: data.orderId,
			payer: data.payer,
			providerPaymentRef: data.providerPaymentRef,
			state: data.state,
			stateHistory: data.stateHistory,
			status: data.status,
			updatedAt: data.updatedAt,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IPayment.DTO): IPayment.Entity {
		return new EPayment(data);
	}

}

export default EPayment;
