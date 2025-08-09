import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {filter, from, map} from "rxjs";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {IAttendee_V2, IEvent_V2} from "@tenant/event/domain";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {IsOrganizerEnum} from "@core/shared/enum";


export const eventResolver: ResolveFn<IEvent_V2<{
	order: IOrder.DTO;
	service: IOrderService.DTO;
}> | undefined> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {

	const sharedUow = inject(SharedUow);
	const orderedServiceId = route.params.id;

	return from(sharedUow.order.findByServiceIds([orderedServiceId])).pipe(
		filter(is.array_not_empty),
		map(([order]) => {
			const service = order.services.find(({_id}) => _id === orderedServiceId) as IOrderService.DTO;

			const attendees = service.orderAppointmentDetails?.specialists.map((specialist) => {
				return {
					_id: specialist.member._id,
					isOrganizer: IsOrganizerEnum.NO,
					is: 'specialist',
					originalData: specialist,
				} as IAttendee_V2;
			});

			service.orderAppointmentDetails?.attendees.forEach((attendee) => {
				attendees.push({
					_id: attendee._id,
					isOrganizer: IsOrganizerEnum.NO,
					is: 'customer',
					originalData: attendee,
				} as IAttendee_V2);
			});

			return {
				_id: order._id,
				start: service.orderAppointmentDetails.start,
				end: service.orderAppointmentDetails.end,
				note: service.customerNote,
				entireBusiness: false,
				attendees,
				is: 'order',
				originalData: {
					order,
					service
				},
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			};
		}),
		filter(is.not_null_or_undefined<IEvent_V2<{ order: IOrder.DTO; service: IOrderService.DTO; }>>),
	);

};
