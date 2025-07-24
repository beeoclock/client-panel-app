import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPayment} from "../interface/i.payment";
import {ICustomer} from "@tenant/customer/domain";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {Types} from "@core/shared/types";
import {PaymentMethodEnum} from "../enum/payment.method.enum";
import {PaymentProviderTypeEnum} from "../enum/payment.provider-type.enum";
import {PaymentStatusEnum} from "../enum/payment.status.enum";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {AnchorTypeEnum} from "@tenant/order/payment/domain/enum/anchor.type.enum";
import {PaymentFormValue} from "@tenant/order/payment/presentation/form/payment.form";

export const PaymentStatusColorMap = {
	[PaymentStatusEnum.pending]: {
		bg: 'bg-yellow-100',
		text: 'text-yellow-800',
	},
	[PaymentStatusEnum.succeeded]: {
		bg: 'bg-green-100',
		text: 'text-green-800',
	},
	[PaymentStatusEnum.failed]: {
		bg: 'bg-red-100',
		text: 'text-red-800',
	},
	[PaymentStatusEnum.registered]: {
		bg: 'bg-blue-100',
		text: 'text-blue-800',
	},
};

export class EPayment extends ABaseEntity<'PaymentDto', IPayment.DTO, IPayment.EntityRaw> implements IPayment.EntityRaw {

	override object = 'PaymentDto' as const;

	providerPaymentRef!: string | null;
	orderId!: string;
	payer!: ICustomer.EntityRaw;
	amount!: number & Types.Minimum<0>;
	currency!: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
	method!: PaymentMethodEnum & Types.Default<PaymentMethodEnum.CASH>;
	providerType?: (PaymentProviderTypeEnum & Types.Default<PaymentProviderTypeEnum.onSite>) | undefined;
	status!: PaymentStatusEnum;
	paymentDate?: string | undefined;
	anchorType!: AnchorTypeEnum & Types.Default<AnchorTypeEnum.order>;
	anchorId?: string | undefined | null;

	public payerToString() {

		const customer = this?.payer;

		if (!customer) {
			return '-';
		}

		if (customer.customerType === CustomerTypeEnum.anonymous) {
			return `-`;
		}

		switch (true) {
			case !!customer?.firstName && !!customer?.lastName:
				return `${customer?.firstName} ${customer?.lastName}`;
			case !!customer?.firstName:
				return customer?.firstName;
			case !!customer?.email:
				return customer?.email;
			case !!customer?.phone:
				return customer?.phone;
		}

		return '-';

	}


	public override toDTO(): IPayment.DTO {
		return EPayment.toDTO(this);
	}

	public static toDTO(data: IPayment.EntityRaw): IPayment.DTO {
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
			anchorType: data.anchorType,
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
	public static fromDTO(data: IPayment.DTO): EPayment {
		return new EPayment(data);
	}

	public static fromFormValue(data: PaymentFormValue): EPayment {
		return new EPayment(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IPayment.EntityRaw): EPayment {
		return new EPayment(data);
	}

	public static fromRawList(items: IPayment.EntityRaw[]): EPayment[] {
		return items.map(item => EPayment.fromRaw(item));
	}

}

export default EPayment;
