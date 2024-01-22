import {Component, Input} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {
	ChangeStatusOnBookedComponent
} from "@event/presentation/component/change-status/change-status-on-booked.component";
import {
	ChangeStatusOnCancelledComponent
} from "@event/presentation/component/change-status/change-status-on-cancelled.component";
import {ChangeStatusOnDoneComponent} from "@event/presentation/component/change-status/change-status-on-done.component";
import {RMIEvent} from "@event/domain";

@Component({
	selector: 'event-buttons-details',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		EditLinkComponent,
		NgIf,
		NgTemplateOutlet,
		ChangeStatusOnBookedComponent,
		ChangeStatusOnCancelledComponent,
		ChangeStatusOnDoneComponent,
	],
	template: `

		<div class="flex justify-between flex-col md:flex-row gap-4">

			<ng-container *ngIf="event.isRequested">

				<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

				<edit-link-component class="w-full" [buttonWidthFull]="true"/>

				<ng-container *ngTemplateOutlet="ButtonToBookEvent"/>

			</ng-container>

			<ng-container *ngIf="event.isBooked">

				<ng-container *ngTemplateOutlet="ButtonToCancelEvent"/>

				<edit-link-component class="w-full" [buttonWidthFull]="true"/>

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
				<a routerLink="repeat" class="
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

		</div>
	`
})
export class ButtonsDetailsComponent {

	@Input({required: true})
	public event!: RMIEvent;

}
