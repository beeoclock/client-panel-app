import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderServiceDetailsDto} from "@order/external/interface/i.order-service-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

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

export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string;
	serviceSnapshot: IServiceDto;
	orderServiceDetails: IOrderServiceDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMetaDto;
	customerNote: string;
}
