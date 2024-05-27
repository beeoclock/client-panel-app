import {Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {
	ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-hour-cell-component',
	template: `{{ hour }}:00`,
	standalone: true,
	encapsulation: ViewEncapsulation.None
})
export class HourCellComponent {

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	@Input()
	public hour!: number;

	@Input()
	public index!: number;

	public readonly stepPerHour = this.composeCalendarWithSpecialistsService.stepPerHour;

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.index > 0 ? ((this.index * this.stepPerHour) + 2) : 2;
	}

	@HostBinding('style.grid-row-end')
	public get gridRowEnd() {
		return this.index > 0 ? ((this.index * this.stepPerHour) + 2) + this.stepPerHour : 2 + this.stepPerHour;
	}

	@HostBinding()
	public get class() {
		return 'z-10 col-start-[1] border-slate-100 dark:border-slate-200/5 border-r border-b text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 bg-white dark:bg-slate-800 font-medium';
	}

}
