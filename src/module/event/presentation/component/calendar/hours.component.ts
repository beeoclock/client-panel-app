import {ChangeDetectionStrategy, Component, HostBinding} from "@angular/core";
import {NgForOf} from "@angular/common";
import {DateTime} from "luxon";

@Component({
	selector: 'event-calendar-hours-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgForOf
	],
	template: `
		<!-- Calendar frame -->
		<div
			class="row-start-[1] col-start-[1] test bg-white h-[50px] sticky top-0 z-10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
			2023
		</div>

		<div
			*ngFor="let hour of hours; let index = index;"
			id="hours-column-{{ hour }}"
			class="row-start-[{{ index + 2 }}] col-start-[1] bg-white border-slate-100 dark:border-slate-200/5 text-xs p-1.5 text-right text-slate-400 uppercase sticky left-0 dark:bg-slate-800 font-medium">
			{{ hour }}
		</div>
	`
})
export class HoursComponent {

	@HostBinding()
	public class = 'sticky z-50 left-0 [&>.test:nth-child(odd)]:bg-white [&>.test:nth-child(even)]:bg-neutral-50 [&>*]:border-b [&>*]:border-neutral-200 [&>*]:border-r hover:[&>.clickMe]:!bg-blue-100 grid grid-cols-[50px] grid-rows-[auto,repeat(24,50px)]';

	public readonly hours = Array.from({length: 24}, (v, k) => DateTime.fromObject({hour: k}).toFormat('HH:mm'));

}
