import {IServiceDto} from "@order/external/interface/i.service.dto";
import {IOrderAppointmentDetailsDto} from "@order/external/interface/i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {IMeta} from "@utility/domain";
import {Tools} from "@utility/tools";
import {Types} from "@utility/types";


export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string & Types.ObjectId;
	serviceSnapshot: IServiceDto;
	orderAppointmentDetails: IOrderAppointmentDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMeta;
	customerNote: string;
}

export const isOrderServiceDto = Tools.createIs<IOrderServiceDto>();
export const validOrderServiceDto = Tools.createValidate<IOrderServiceDto>();
export const randomOrderServiceDto = Tools.createRandom<IOrderServiceDto>();
