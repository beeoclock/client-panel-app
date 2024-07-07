import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderAppointmentDetailsDto} from "@order/external/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import typia from "typia";
import {IMeta} from "@utility/domain";


export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string;
	serviceSnapshot: IServiceDto;
	orderAppointmentDetails: IOrderAppointmentDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMeta;
	customerNote: string;
}

export const isOrderServiceDto = typia.createIs<IOrderServiceDto>();
export const validOrderServiceDto = typia.createValidate<IOrderServiceDto>();
export const randomOrderServiceDto = typia.createRandom<IOrderServiceDto>();
