import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {BaseService} from "@core/shared/service/base.service";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";

type ENTITY_RAW = IOrderService.EntityRaw;

export class OrderServiceService extends BaseService<ENTITY_RAW> {

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 * @param statuses
	 */
	public async findByServicesRangeAndStatuses(start: string, end: string, statuses: OrderServiceStatusEnum[]) {
		return this.db.filter(({orderAppointmentDetails, status}) => {
			return (
				statuses.includes(status)
			) && (
				(orderAppointmentDetails.start >= start && orderAppointmentDetails.start < end) ||
				(orderAppointmentDetails.end > start && orderAppointmentDetails.end <= end) ||
				(orderAppointmentDetails.start < start && orderAppointmentDetails.end > end)
			);
		}).toArray();
	}

}
