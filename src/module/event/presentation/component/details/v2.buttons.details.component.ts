import {Component, HostBinding, inject, Input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {
	ChangeStatusOnBookedComponent
} from "@event/presentation/component/change-status/change-status-on-booked.component";
import {
	ChangeStatusOnCancelledComponent
} from "@event/presentation/component/change-status/change-status-on-cancelled.component";
import {ChangeStatusOnDoneComponent} from "@event/presentation/component/change-status/change-status-on-done.component";
import {IEvent_V2} from "@event/domain";
import {DeleteButtonComponent} from "@event/presentation/component/button/delete-button/delete-button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {Store} from "@ngxs/store";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'app-event-v2-buttons-details',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		NgIf,
		NgTemplateOutlet,
		ChangeStatusOnBookedComponent,
		ChangeStatusOnCancelledComponent,
		ChangeStatusOnDoneComponent,
		DeleteButtonComponent,
		EditButtonComponent,
	],
	template: `
<!--		<event-delete-button-component [event]="event"/>-->

		<edit-button-component (click)="editEvent()"/>

		<ng-container *ngIf="isPending">

			<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

			<ng-container *ngTemplateOutlet="ButtonToBookEvent"/>

		</ng-container>

		<ng-container *ngIf="isAccepted">

			<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

			<ng-container *ngTemplateOutlet="ButtonToDoneEvent"/>

		</ng-container>

		<ng-container *ngIf="isDone">

			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

		</ng-container>

		<ng-container *ngIf="isNegative">

			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

		</ng-container>

		<ng-template #ButtonToCancelEvent>
<!--			<event-change-status-on-cancelled-component [event]="event"/>-->
		</ng-template>

		<ng-template #ButtonToBookEvent>
<!--			<event-change-status-on-booked-component [event]="event"/>-->
		</ng-template>

		<ng-template #ButtonToDoneEvent>
<!--			<event-change-status-on-done-component [event]="event"/>-->
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
	`
})
export class V2ButtonsDetailsComponent implements OnChanges {

	@Input({required: true})
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@HostBinding()
	public class = 'flex justify-between flex-col gap-4 bg-white p-4 border-y';

	public isNegative = false;
	public isDone = false;
	public isAccepted = false;
	public isPending = false;

	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);

	public editEvent() {
		// this.store.dispatch(new .OpenFormToEditById(this.event._id));
		// TODO: Detect which form to open? of service or of order?
	}

	public openFormToRepeat() {

		this.ngxLogger.info('V2ButtonsDetailsComponent:openFormToRepeat');

	}

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

		const { event } = changes;

		if (event) {
			const { currentValue } = event;
			const { originalData } = currentValue as IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
			const { status } = originalData.service;
			this.isNegative = [OrderServiceStatusEnum.cancelled, OrderServiceStatusEnum.rejected].includes(status);
			this.isDone = [OrderServiceStatusEnum.done].includes(status);
			this.isAccepted = [OrderServiceStatusEnum.accepted].includes(status);
			this.isPending = [OrderServiceStatusEnum.pending].includes(status);
		}

	}

}