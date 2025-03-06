import {Component, inject, Input, OnChanges, signal, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {IOrderServiceDto} from "@core/business-logic/order/interface/i.order-service.dto";
import {EventActions} from "@event/infrastructure/state/event/event.actions";
import {IAttendee_V2} from "@event/domain";
import {IsOrganizerEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	ContainerChangeStatusButtonComponent
} from "@order/presentation/component/details/change-status/container.change-status.button.component";
import {
	ListServiceFormCardOrderComponent
} from "@order/presentation/component/list/card/item/services/list.service.form.card.order.component";
import {PaymentStatusEnum} from "@core/business-logic/payment/enum/payment.status.enum";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Component({
	selector: 'order-detail-page',
	templateUrl: './order-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		EditButtonComponent,
		ContainerChangeStatusButtonComponent,
		ListServiceFormCardOrderComponent,
	],
	standalone: true
})
export class OrderDetailsContainerComponent implements OnChanges {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: IOrder.DTO;

	public readonly payment = signal<IPayment.DTO | null>(null);

	public readonly idPrefix = 'order-details-container';

	public readonly store = inject(Store);
	public readonly sharedUow = inject(SharedUow);

	public ngOnChanges(changes: SimpleChanges) {
		this.initPayment().then();
	}

	public async initPayment() {
		if (!this.item) {
			return;
		}
		const {items: {0: payment}} = await this.sharedUow.payment.repository.findAsync({
			orderId: this.item._id,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});
		this.payment.set(payment);
	}

	// public async delete(order: IOrder.DTO) {
	//
	// 	const {status} = order;
	//
	// 	if ([OrderStatusEnum.confirmed, OrderStatusEnum.inProgress, OrderStatusEnum.requested].includes(status)) {
	//
	// 		return alert('You can\'t delete order with status ' + status + ', change status on one of the following: ' + OrderStatusEnum.draft + ', ' + OrderStatusEnum.cancelled + ', ' + OrderStatusEnum.rejected + ', '  + OrderStatusEnum.done);
	//
	// 	}
	//
	// 	await firstValueFrom(this.store.dispatch(new OrderActions.DeleteItem(order._id)));
	//
	// }

	public openForm() {
		if (!this.item) {
			return
		}
		this.store.dispatch(new OrderActions.OpenFormToEditById(this.item?._id));
	}

	public openAppointmentDetails(service: IOrderServiceDto) {


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

		this.store.dispatch(new EventActions.OpenDetails({
			_id: service._id,
			start: service.orderAppointmentDetails.start,
			end: service.orderAppointmentDetails.end,
			note: service.customerNote,
			entireBusiness: false,
			attendees,
			is: 'order',
			originalData: {
				order: this.item,
				service
			},
			createdAt: service.orderAppointmentDetails.createdAt,
			updatedAt: service.orderAppointmentDetails.updatedAt,
		}));

	}

	protected readonly paymentStatusEnum = PaymentStatusEnum;
}
