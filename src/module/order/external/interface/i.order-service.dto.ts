import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderAppointmentDetailsDto} from "@order/external/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import typia from "typia";

export interface IHistoryDto {
	object: 'HistoryEntryDto';
	issuerRole: string;
	issuerId: string;
	reason: string;
	value: string;
	createdAt: string;
}

export interface IMetaDto {
	object: 'MetaDto';
	history: IHistoryDto[];
}

export const isMetaDto = typia.createIs<IMetaDto>();
export const validMetaDto = typia.createValidate<IMetaDto>();
export const randomMetaDto = typia.createRandom<IMetaDto>();

export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string;
	serviceSnapshot: IServiceDto;
	orderAppointmentDetails: IOrderAppointmentDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMetaDto;
	customerNote: string;
}

export const isOrderServiceDto = typia.createIs<IOrderServiceDto>();
export const validOrderServiceDto = typia.createValidate<IOrderServiceDto>();
export const randomOrderServiceDto = typia.createRandom<IOrderServiceDto>();
