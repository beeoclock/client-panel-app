import {Injectable} from "@angular/core";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY_RAW = IOrder.EntityRaw;

@Injectable()
export class OrderService extends BaseService<ENTITY_RAW> {

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 * @param statuses
	 */
	public async findByServicesRangeAndStatuses(start: string, end: string, statuses: OrderServiceStatusEnum[]) {
		return this.db.filter(({services}) =>
			services.some((service) =>
					(
						statuses.includes(service.status)
					) && (
						(service.orderAppointmentDetails.start >= start && service.orderAppointmentDetails.start < end) ||
						(service.orderAppointmentDetails.end > start && service.orderAppointmentDetails.end <= end) ||
						(service.orderAppointmentDetails.start < start && service.orderAppointmentDetails.end > end)
					)
			)
		).toArray();
	}

}
