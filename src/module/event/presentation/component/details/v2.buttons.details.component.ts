import {Component, HostBinding, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";
import {
	ChangeStatusOnAcceptedComponent
} from "@event/presentation/component/change-status/change-status-on-accepted.component";
import {ChangeStatusOnDoneComponent} from "@event/presentation/component/change-status/change-status-on-done.component";
import {IEvent_V2} from "@event/domain";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {Store} from "@ngxs/store";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {IOrderServiceDto} from "@src/core/business-logic/order/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@src/core/business-logic/order/enum/order-service.status.enum";
import {NGXLogger} from "ngx-logger";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {
	ChangeStatusOnRejectedComponent
} from "@event/presentation/component/change-status/change-status-on-rejected.component";
import {
	ChangeStatusOnCancelledComponent
} from "@event/presentation/component/change-status/change-status-on-cancelled.component";

@Component({
	selector: 'app-event-v2-buttons-details',
	standalone: true,
	imports: [
		TranslateModule,
		NgTemplateOutlet,
		ChangeStatusOnAcceptedComponent,
		ChangeStatusOnDoneComponent,
		EditButtonComponent,
		ChangeStatusOnRejectedComponent,
		ChangeStatusOnCancelledComponent,
	],
	template: `

		@if (isRequested) {
			<ng-container *ngTemplateOutlet="ButtonToRejectEvent"/>
			<edit-button-component (click)="editEvent()"/>
			<ng-container *ngTemplateOutlet="ButtonToAcceptEvent"/>

		}

		@if (inProgress) {

			<edit-button-component (click)="editEvent()"/>
			<ng-container *ngTemplateOutlet="ButtonToRejectEvent"/>
		}


		@if (isAccepted) {

			<ng-container *ngTemplateOutlet="ButtonToCancelledEvent"/>
			<edit-button-component (click)="editEvent()"/>
			<ng-container *ngTemplateOutlet="ButtonToDoneEvent"/>
		}

		@if (isDone) {

			<edit-button-component (click)="editEvent()"/>
			<!--			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>-->
		}

		@if (isNegative) {

			<edit-button-component (click)="editEvent()"/>
			<!--			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>-->
		}

		<ng-template #ButtonToRejectEvent>
			<event-change-status-on-rejected-component [event]="event()"/>
		</ng-template>

		<ng-template #ButtonToAcceptEvent>
			<event-change-status-on-accepted-component [event]="event()"/>
		</ng-template>

		<ng-template #ButtonToDoneEvent>
			<event-change-status-on-done-component [event]="event()"/>
		</ng-template>

		<ng-template #ButtonToCancelledEvent>
			<event-change-status-on-cancelled-component [event]="event()"/>
		</ng-template>

		<ng-template #ButtonToRepeatEvent>
			<button (click)="openFormToRepeat()" class="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-3
              py-2
              text-sm
              font-semibold
              text-blue-700
              shadow-sm
              ring-1
              ring-inset
              ring-blue-300
              hover:bg-blue-100">
				<i class="bi bi-arrow-repeat"></i>
				{{ 'event.keyword.capitalize.repeat' | translate }}
			</button>
		</ng-template>

<!--		<hr>-->

<!--		<event-delete-button-component [event]="event"/>-->
	`
})
export class V2ButtonsDetailsComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
		order: IOrderDto;
		service: IOrderServiceDto;
	}>>();

	@HostBinding()
	public class = 'flex justify-between flex-col gap-4 bg-white p-4 border-y';

	public isNegative = false;
	public isDone = false;
	public isAccepted = false;
	public inProgress = false;
	public isRequested = false;

	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);

	public editEvent() {

		this.store.dispatch(new OrderActions.OpenOrderServiceForm({
			orderId: this.event().originalData.order._id,
			item: this.event().originalData.service,
			isEditMode: true
		}));

	}

	public openFormToRepeat() {

		this.ngxLogger.info('V2ButtonsDetailsComponent:openFormToRepeat');

	}

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

		const {event} = changes;

		if (event) {
			const {currentValue} = event;
			const {originalData} = currentValue as IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
			const {status} = originalData.service;
			this.isNegative = [OrderServiceStatusEnum.cancelled, OrderServiceStatusEnum.rejected].includes(status);
			this.isDone = [OrderServiceStatusEnum.done].includes(status);
			this.isAccepted = [OrderServiceStatusEnum.accepted].includes(status);
			this.inProgress = [OrderServiceStatusEnum.inProgress].includes(status);
			this.isRequested = [OrderServiceStatusEnum.requested].includes(status);
		}

	}

}
