import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {RIEvent} from "@event/domain";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {
	EventCardComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/event-card.component";
import {
	ListOfEventsInTheGroupComponent
} from "@page/event/calendar-with-specialists/component/container/data-frame/event-card/list-of-events-in-the-group.component";

@Component({
	selector: 'group-event-card-component',
	template: `
		<event-card-component
			[id]="event.data._id"
			[card]="event.card"
			[event]="event"/>
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
		EventCardComponent,
		NgForOf
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEventCardComponent {

	@Input()
	public groupEvents!: {
		data: RIEvent;
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

}
