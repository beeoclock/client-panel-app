import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {BaseService} from "@core/shared/service/base.service";
import {StateEnum} from "@core/shared/enum/state.enum";

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

	public async findBySpecialistIds(ids: string[]) {
		return this.db.filter(({services}) => services.some(({orderAppointmentDetails: {specialists}}) => specialists.some(({member: {_id}}) => ids.includes(_id)))).toArray();
	}

	public async findBySpecialistIdsAndDateTimeRange(ids: string[], start: string, end: string, states: StateEnum[] = []) {
		return this.db.filter(({services, state}) => services.some(({orderAppointmentDetails: {specialists, start: serviceStart, end: serviceEnd}, status}) => {
			if ([OrderServiceStatusEnum.deleted, OrderServiceStatusEnum.rejected, OrderServiceStatusEnum.cancelled].includes(status)) {
				return false;
			}
			if (!specialists.some(({member: {_id}}) => ids.includes(_id))) {
				return false;
			}
			if (states.length > 0 && !states.includes(state)) {
				return false;
			}
			return (
				(serviceStart >= start && serviceStart < end) || // service starts within the range
				(serviceEnd > start && serviceEnd <= end) || // service ends within the range
				(serviceStart < start && serviceEnd > end) // service spans the entire range
			);
		})).toArray();
	}

}
