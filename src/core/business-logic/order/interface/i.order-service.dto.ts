import {IServiceDto} from "./i.service.dto";
import {IOrderAppointmentDetailsDto} from "./i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "../enum/order-service.status.enum";
import {IMeta} from "@utility/domain";
import {Tools} from "../../../shared/tools";
import {Types} from "../../../shared/types";


export interface IOrderServiceDto {
	object: "OrderServiceDto";
	_id: string & Types.ObjectId;
	orderId: string & Types.ObjectId;
	serviceSnapshot: IServiceDto;
	orderAppointmentDetails: IOrderAppointmentDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMeta;
	customerNote: string;
}

export const isOrderServiceDto = Tools.createIs<IOrderServiceDto>();
export const validOrderServiceDto = Tools.createValidate<IOrderServiceDto>();
export const randomOrderServiceDto = Tools.createRandom<IOrderServiceDto>();
