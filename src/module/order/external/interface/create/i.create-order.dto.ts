import {IOrderProductDto} from "@order/external/interface/i.order-product.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {CustomerTypeEnum} from "@src/module/customer/domain/enum/customer-type.enum";
import {ActiveEnum} from "@utility/domain/enum";
import {PaymentMethodEnum} from "@module/payment/domain/enum/payment.method.enum";

export interface IPayerDto {
	_id?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	note?: string;
	active?: ActiveEnum;
	customerType?: CustomerTypeEnum;
	createdAt?: string;
	updatedAt?: string;
}

export interface ICreateOrderDto {
	object: "CreateOrderDto";
	_id: string;
	products: IOrderProductDto[],
	services: IOrderServiceDto[];
	payer: IPayerDto;
	paymentMethod: PaymentMethodEnum;
}

export type IListCreateOrderDto = ICreateOrderDto[];
