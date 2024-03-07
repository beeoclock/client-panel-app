import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";

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

	@Input()
	public slotInMinutes!: number;

	@Input()
	public startTimeToDisplay!: number;

	@Input()
	public stepPerHour!: number;

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.card.startTime > 0 ? ((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 2 : 2;
	}

	@HostBinding('style.grid-row-end')
	public get gridRowEnd() {
		return (this.card.startTime > 0 ? (((this.card.startTime - this.startTimeToDisplay) * this.stepPerHour) + 2) : 2) + (this.card.durationInMinutes / this.slotInMinutes);
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
