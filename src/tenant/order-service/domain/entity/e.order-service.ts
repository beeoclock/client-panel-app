import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IOrderService} from "../interface/i.order-service.dto";
import {Types} from "@core/shared/types";
import {IMeta} from "@src/shared/domain";
import {IService} from "@tenant/service/domain/interface/i.service";
import {OrderServiceStatusEnum} from "../enum/order-service.status.enum";
import {IOrderAppointmentDetailsDto} from "../interface/i-order-appointment-details.dto";


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
			orderId: data.orderId,
			serviceSnapshot: data.serviceSnapshot,
			orderAppointmentDetails: data.orderAppointmentDetails,
			customerNote: data.customerNote,
			status: data.status,

			_id: data._id,
			object: data.object,
			meta: data.meta,
			state: data.state,
			stateHistory: data.stateHistory,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
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

}

export default EOrderService;
