import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {IEvent_V2} from "@event/domain";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {
	OrderEventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/order-event-card.component";
import {
	ListOfEventsInTheGroupComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/list-of-events-in-the-group.component";
import {
	AbsenceEventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/absence-event-card.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";

@Component({
	selector: 'group-event-card-component',
	template: `
		<ng-container *ngIf="isOrder(event); else AbsenceTemplate">

			<order-event-card-component
				[id]="event.data._id"
				[card]="event.card"
				[event]="event"/>

		</ng-container>
		<ng-template #AbsenceTemplate>
			<ng-container *ngIf="isAbsence(event); else UnknownTemplate">
				<absence-event-card-component
					[id]="event.data._id"
					[card]="event.card"
					[event]="event"/>
			</ng-container>
		</ng-template>
		<ng-template #UnknownTemplate>
			<!--            Unknown            -->
		</ng-template>
		<div class="z-10">
			<button type="button" (click)="openPushBoxWithEvents()" class="border rounded-2xl p-1 mt-1 mb-1 mr-1 flex justify-center items-center cursor-pointer transition-all hover:bg-blue-100 hover:text-blue-600 hover:border-blue-400">
				+{{ groupEvents.length - 1 }}
			</button>
		</div>
	`,
	standalone: true,
	imports: [
		DatePipe,
		NgIf,
		OrderEventCardComponent,
		NgForOf,
		AbsenceEventCardComponent
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEventCardComponent {

	@Input()
	public groupEvents!: {
		data: IEvent_V2;
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
	}[];

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly pushBoxService = inject(PushBoxService);

	public readonly slotInMinutes = this.composeCalendarWithSpecialistsService.slotInMinutes;
	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;
	public readonly stepPerHour = this.composeCalendarWithSpecialistsService.stepPerHour;

	public get card() {
		return this.groupEvents[0].card;
	}

	public get event() {
		return this.groupEvents[0];
	}

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.card.startTime > 0 ? (((this.card.startTime | 0) - this.startTimeToDisplay) * this.stepPerHour) + 1 : 1;
	}

	@HostBinding('style.grid-row-end')
	public get gridRowEnd() {
		return (this.card.startTime > 0 ? ((((this.card.startTime | 0) - this.startTimeToDisplay) * this.stepPerHour) + 1) : 1) + (this.card.durationInMinutes / this.slotInMinutes);
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.card.column;
	}

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'flex flex',
		];

		return classList.join(' ');
	}

	public async openPushBoxWithEvents() {
		await this.pushBoxService.buildItAsync({
			component: ListOfEventsInTheGroupComponent,
			componentInputs: {
				groupEvents: this.groupEvents.slice(1)
			}
		});
	}

	public isOrder(event: { data: IEvent_V2 }): event is {
		data: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
	} {
		return event.data.is === 'order';
	}

	public isAbsence(event: { data: IEvent_V2 }): event is {
		data: IEvent_V2<IAbsenceDto>;
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
	} {
		return event.data.is === 'absence';
	}

}
