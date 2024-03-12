import {Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-card-component',
	template: `
		<span class="text-xs text-blue-600 dark:text-sky-100">{{ card.startTime }}</span>
		<span class="text-xs font-medium text-blue-600 dark:text-sky-100">{{ event.title }}</span>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None
})
export class EventCardComponent {

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	@Input()
	public event!: {
		title: string;
		description: string;
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
	};

	@Input()
	public card!: {
		startTime: number;
		durationInMinutes: number;
		column: number;
	};

	public readonly slotInMinutes = this.composeCalendarWithSpecialistsService.slotInMinutes;

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	public readonly stepPerHour = this.composeCalendarWithSpecialistsService.stepPerHour;

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.card.startTime > 0 ? ((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1 : 1;
	}

	@HostBinding('style.grid-row-end')
	public get gridRowEnd() {
		return (this.card.startTime > 0 ? (((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 1) : 1) + (this.card.durationInMinutes / this.slotInMinutes);
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.card.column;
	}

	@HostBinding('class')
	public get class() {
		return 'transition-all hover:cursor-pointer hover:bg-blue-500 z-10 bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg m-1 p-1 flex flex-col';
	}

}
