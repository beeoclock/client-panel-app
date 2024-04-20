import {Component, HostBinding, inject, Input} from "@angular/core";
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
import {RMIEvent} from "@event/domain";
import {DeleteButtonComponent} from "@event/presentation/component/button/delete-button/delete-button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {EventActions} from "@event/state/event/event.actions";
import {Store} from "@ngxs/store";

@Component({
	selector: 'event-buttons-details',
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
		<event-delete-button-component [event]="event"/>

		<edit-button-component (click)="editEvent()"/>

		<ng-container *ngIf="event.isRequested">

			<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

			<ng-container *ngTemplateOutlet="ButtonToBookEvent"/>

		</ng-container>

		<ng-container *ngIf="event.isBooked">

			<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

			<ng-container *ngTemplateOutlet="ButtonToDoneEvent"/>

		</ng-container>

		<ng-container *ngIf="event.isDone">

			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

		</ng-container>

		<ng-container *ngIf="event.isCancelled">

			<ng-container *ngTemplateOutlet="ButtonToRepeatEvent"/>

		</ng-container>

		<ng-template #ButtonToCancelEvent>
			<event-change-status-on-cancelled-component [event]="event"/>
		</ng-template>

		<ng-template #ButtonToBookEvent>
			<event-change-status-on-booked-component [event]="event"/>
		</ng-template>

		<ng-template #ButtonToDoneEvent>
			<event-change-status-on-done-component [event]="event"/>
		</ng-template>

		<ng-template #ButtonToRepeatEvent>
			<a [routerLink]="'/event/' + event._id + '/repeat'" class="
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
			</a>
		</ng-template>
	`
})
export class ButtonsDetailsComponent {

	@Input({required: true})
	public event!: RMIEvent;

	@HostBinding()
	public class = 'flex justify-between flex-col gap-4 bg-white p-4 border-y';

	private readonly store = inject(Store);

	public editEvent() {
		this.store.dispatch(new EventActions.OpenFormToEditById(this.event._id));
	}

}
