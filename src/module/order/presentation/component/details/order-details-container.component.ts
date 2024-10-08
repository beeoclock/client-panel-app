import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {NgForOf, NgIf} from "@angular/common";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {
	OrderServiceDetailsComponent
} from "@order/presentation/component/details/service/order-service-details.component";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {EventActions} from "@event/state/event/event.actions";
import {IAttendee_V2} from "@event/domain";
import {IsOrganizerEnum} from "@utility/domain/enum";
import {
	ContainerChangeStatusButtonComponent
} from "@order/presentation/component/details/change-status/container.change-status.button.component";
import {
	ListServiceFormCardOrderComponent
} from "@order/presentation/component/list/card/item/services/list.service.form.card.order.component";

@Component({
	selector: 'order-detail-page',
	templateUrl: './order-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		DeleteButtonComponent,
		EditButtonComponent,
		ActiveStyleDirective,
		NgIf,
		LinkButtonDirective,
		NgForOf,
		OrderServiceDetailsComponent,
		PrimaryLinkButtonDirective,
		ContainerChangeStatusButtonComponent,
		ListServiceFormCardOrderComponent,
	],
	standalone: true
})
export class OrderDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: IOrderDto;

	public readonly idPrefix = 'order-details-container';

	public readonly store = inject(Store);

	public async delete(order: IOrderDto) {

		const {status} = order;

		if ([OrderStatusEnum.confirmed, OrderStatusEnum.inProgress, OrderStatusEnum.requested].includes(status)) {

			return alert('You can\'t delete order with status ' + status + ', change status on one of the following: ' + OrderStatusEnum.draft + ', ' + OrderStatusEnum.cancelled + ', ' + OrderStatusEnum.rejected + ', '  + OrderStatusEnum.done);

		}

		await firstValueFrom(this.store.dispatch(new OrderActions.DeleteItem(order._id)));

	}

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

}
