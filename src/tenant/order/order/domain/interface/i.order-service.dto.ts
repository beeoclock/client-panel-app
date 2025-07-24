import {IOrderAppointmentDetailsDto} from "./i-order-appointment-details.dto";
import {IBaseEntityRaw, IMeta} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {Types} from "@core/shared/types";
import {IService} from "@tenant/service/domain/interface/i.service";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";


export interface IOrderServiceDto extends IBaseEntityRaw<'OrderServiceDto'> {
	orderId: string & Types.ObjectId;
	serviceSnapshot: IService.DTO;
	orderAppointmentDetails: IOrderAppointmentDetailsDto;
	status: OrderServiceStatusEnum;
	meta: IMeta;
	customerNote: string;

	// TODO: Implement BOC-
	// specialistReadyAt: string | null; // New field added, the field talks about the time the specialist is ready to start the service, specialist can set the date only if start in future
}

export const isOrderServiceDto = Tools.createIs<IOrderServiceDto>();
export const validOrderServiceDto = Tools.createValidate<IOrderServiceDto>();
export const randomOrderServiceDto = Tools.createRandom<IOrderServiceDto>();
