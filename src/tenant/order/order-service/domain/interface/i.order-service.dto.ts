import {IOrderAppointmentDetailsDto} from "./i-order-appointment-details.dto";
import {OrderServiceStatusEnum} from "../enum/order-service.status.enum";
import {IBaseDTO, IBaseEntityRaw, IMeta} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {Types} from "@core/shared/types";
import {IService} from "@tenant/service/domain/interface/i.service";

export namespace IOrderService {

	export interface DTO extends IBaseDTO<'OrderServiceDto'> {

		orderId: string & Types.ObjectId;
		serviceSnapshot: IService.DTO;
		orderAppointmentDetails: IOrderAppointmentDetailsDto;
		status: OrderServiceStatusEnum;
		meta: IMeta;
		customerNote: string;

		// TODO: Implement BOC-
		// specialistReadyAt: string | null; // New field added, the field talks about the time the specialist is ready to start the service, specialist can set the date only if start in future

	}

	export type EntityRaw = IBaseEntityRaw<'OrderServiceDto'> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	};

}

export const isOrderServiceDto = Tools.createIs<IOrderService.DTO>();
export const validOrderServiceDto = Tools.createValidate<IOrderService.DTO>();
export const randomOrderServiceDto = Tools.createRandom<IOrderService.DTO>();
