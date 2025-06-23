import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrderService} from "../interface/i.order-service.dto";
import {Types} from "@core/shared/types";
import {IMeta} from "@shared/domain";
import {IService} from "@tenant/service/domain/interface/i.service";
import {OrderServiceStatusEnum} from "../enum/order-service.status.enum";
import {IOrderAppointmentDetailsDto} from "../interface/i-order-appointment-details.dto";

export const OrderServiceColorStatusMap = {
	[OrderServiceStatusEnum.requested]: {
		bg: 'bg-blue-100',
		text: 'text-blue-800',
	},
	[OrderServiceStatusEnum.accepted]: {
		bg: 'bg-green-100',
		text: 'text-green-800',
	},
	[OrderServiceStatusEnum.ready]: {
		bg: 'bg-yellow-100',
		text: 'text-yellow-800',
	},
	[OrderServiceStatusEnum.inProgress]: {
		bg: 'bg-orange-100',
		text: 'text-orange-800',
	},
	[OrderServiceStatusEnum.done]: {
		bg: 'bg-green-100',
		text: 'text-green-800',
	},
	[OrderServiceStatusEnum.rejected]: {
		bg: 'bg-red-100',
		text: 'text-red-800',
	},
	[OrderServiceStatusEnum.cancelled]: {
		bg: 'bg-gray-100',
		text: 'text-gray-800',
	},
	[OrderServiceStatusEnum.deleted]: {
		bg: 'bg-gray-200',
		text: 'text-gray-800',
	},
}

export class EOrderService extends ABaseEntity<'OrderServiceDto', IOrderService.DTO, IOrderService.EntityRaw> implements IOrderService.EntityRaw {

	orderId!: string & Types.ObjectId;
	serviceSnapshot!: IService.DTO;
	orderAppointmentDetails!: IOrderAppointmentDetailsDto;
	status!: OrderServiceStatusEnum;
	customerNote!: string;

	meta!: IMeta;

	override object = 'OrderServiceDto' as const;


	public override toDTO(): IOrderService.DTO {
		return EOrderService.toDTO(this);
	}

	public static toDTO(data: IOrderService.EntityRaw): IOrderService.DTO {
		return {
			orderAppointmentDetails: data.orderAppointmentDetails,
			serviceSnapshot: data.serviceSnapshot,
			customerNote: data.customerNote,
			orderId: data.orderId,
			status: data.status,

			_id: data._id,
			meta: data.meta,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IOrderService.DTO): EOrderService {
		return new EOrderService(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IOrderService.EntityRaw): EOrderService {
		return new EOrderService(data);
	}

	public static fromDTOList(data: IOrderService.DTO[]): EOrderService[] {
		return data.map(item => EOrderService.fromDTO(item));
	}

	public static fromRawList(data: IOrderService.EntityRaw[]): EOrderService[] {
		return data.map(item => EOrderService.fromRaw(item));
	}

}

export default EOrderService;
