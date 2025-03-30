import {Component, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";
import {
	ChangeStatusOnAcceptedComponent
} from "@tenant/event/presentation/ui/component/change-status/change-status-on-accepted.component";
import {
	ChangeStatusOnDoneComponent
} from "@tenant/event/presentation/ui/component/change-status/change-status-on-done.component";
import {IEvent_V2} from "@tenant/event/domain";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/domain/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@tenant/order/domain/enum/order-service.status.enum";
import {NGXLogger} from "ngx-logger";
import {
	ChangeStatusOnRejectedComponent
} from "@tenant/event/presentation/ui/component/change-status/change-status-on-rejected.component";
import {
	ChangeStatusOnCancelledComponent
} from "@tenant/event/presentation/ui/component/change-status/change-status-on-cancelled.component";

@Component({
	selector: 'app-event-v2-buttons-details',
	standalone: true,
	imports: [
		TranslateModule,
		NgTemplateOutlet,
		ChangeStatusOnAcceptedComponent,
		ChangeStatusOnDoneComponent,
		ChangeStatusOnRejectedComponent,
		ChangeStatusOnCancelledComponent,
	],
	template: `

		@if (isRequested) {
			<ng-container *ngTemplateOutlet="ButtonToRejectEvent"/>
			<ng-container *ngTemplateOutlet="ButtonToAcceptEvent"/>

		}

		@if (inProgress) {

			<ng-container *ngTemplateOutlet="ButtonToRejectEvent"/>
		}


		@if (isAccepted) {

			<ng-container *ngTemplateOutlet="ButtonToCancelledEvent"/>
			<ng-container *ngTemplateOutlet="ButtonToDoneEvent"/>
		}

		@if (isDone) {

			<!--			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>-->
		}

		@if (isNegative) {

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
	`,
	host: {
		class: 'flex justify-between flex-col gap-4 bg-white p-4 border-y'
	}
})
export class V2ButtonsDetailsComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
		order: IOrder.DTO;
		service: IOrderServiceDto;
	}>>();

	public isNegative = false;
	public isDone = false;
	public isAccepted = false;
	public inProgress = false;
	public isRequested = false;

	private readonly ngxLogger = inject(NGXLogger);

	public openFormToRepeat() {
		this.ngxLogger.info('V2ButtonsDetailsComponent:openFormToRepeat');
	}

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

		const {event} = changes;

		if (event) {
			const {currentValue} = event;
			const {originalData} = currentValue as IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; }>;
			const {status} = originalData.service;
			this.isNegative = [OrderServiceStatusEnum.cancelled, OrderServiceStatusEnum.rejected].includes(status);
			this.isDone = [OrderServiceStatusEnum.done].includes(status);
			this.isAccepted = [OrderServiceStatusEnum.accepted].includes(status);
			this.inProgress = [OrderServiceStatusEnum.inProgress].includes(status);
			this.isRequested = [OrderServiceStatusEnum.requested].includes(status);
		}

	}

}
