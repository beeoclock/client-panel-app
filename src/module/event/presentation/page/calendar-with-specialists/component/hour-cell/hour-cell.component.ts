import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'event-hour-cell-component',
	template: `{{ hour }}:00`,
	standalone: true,
	encapsulation: ViewEncapsulation.None
})
export class HourCellComponent {

	@Input()
	public hour!: number;

	@Input()
	public index!: number;

	@Input()
	public stepPerHour!: number;

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
