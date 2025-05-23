import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY_RAW = IOrder.EntityRaw;

export class OrderService extends BaseService<ENTITY_RAW> {

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 * @param statuses
	 */
	public async findByServicesRangeAndStatuses(start: string, end: string, statuses: OrderServiceStatusEnum[]) {
		return this.db.filter(({services}) =>
			services.some((service) => {
				return (
					statuses.includes(service.status)
				) && (
					(service.orderAppointmentDetails.start >= start && service.orderAppointmentDetails.start < end) ||
					(service.orderAppointmentDetails.end > start && service.orderAppointmentDetails.end <= end) ||
					(service.orderAppointmentDetails.start < start && service.orderAppointmentDetails.end > end)
				);
			})
		).toArray();
	}

	public async findByServiceIds(ids: string[]) {
		return this.db.filter(({services}) => services.some(({_id}) => ids.includes(_id))).toArray();
	}

}
