import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderServiceDetailsDto} from "@order/external/interface/i.order-service-details.dto";

export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string;
	serviceSnapshot: IServiceDto;
	orderServiceDetails: IOrderServiceDetailsDto;
	status: string;
	meta: {
		object: string;
		history: {
			object: string;
			issuerRole: string;
			issuerId: string;
			reason: string;
			value: string;
			createdAt: string;
		}[];
	};
	customerNote: string;
}
