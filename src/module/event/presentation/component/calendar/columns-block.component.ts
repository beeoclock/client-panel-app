import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {DataBlockComponent} from "@event/presentation/component/calendar/data-block.component";
import {CellComponent} from "@event/presentation/component/calendar/cell.component";
import {DateTime, Interval} from "luxon";

@Component({
	selector: 'event-calendar-columns-block-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		DataBlockComponent,
		CellComponent
	],
	template: `
		<div
			class="[&>*]:border-b [&>*]:border-neutral-200 [&>*]:border-r hover:[&>.clickMe]:!bg-blue-100 flex flex-col"
			*ngFor="let day of days; trackBy: dayIdentify">
			<!-- Columns Header -->
			<div
				class="h-[50px] bg-white test sticky top-0 z-10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
				{{ day.toFormat('dd.MM (EEE)') }}
			</div>
			<!-- Columns Body -->
			<ng-container *ngFor="let hour of getHours(day); trackBy: hourIdentify">
				<event-calendar-cell-component
					[baseId]="day.toFormat('dd.MM.yyyy')"
					[date]="hour.toJSDate().toISOString()"
					[idSuffix]="hour.toFormat('HH:mm')"/>
			</ng-container>
		</div>
	`
})
export class ColumnsBlockComponent implements OnChanges {

	@HostBinding()
	public class = 'grid';

	@HostBinding()
	public style = '';

	@Input()
	public rowsAmount = 24;

	@Input()
	public preferences!: {
		from: Date;
		to: Date;
	};

	public days: DateTime[] = [];

	// Using outside of template
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public dayIdentify(index: number, day: DateTime) {
		return day.toFormat('dd.MM.yyyy');
	}
	public hourIdentify(index: number, hour: DateTime) {
		return hour.toFormat('HH:mm');
	}

	public ngOnChanges(changes: SimpleChanges & {preferences: {currentValue: ColumnsBlockComponent['preferences']} }): void {

		console.log('changes', changes)

		const {preferences} = changes;

		if (preferences.currentValue) {

			const {from, to} = preferences.currentValue;
			this.days = Interval.fromDateTimes(from, to).splitBy({days: 1}).map(({start}) => start) as DateTime[]

			this.style += ` grid-template-columns: repeat(${this.days.length}, auto);`;
			this.style += ` min-width: calc(100% - 50px);`;

			this.changeDetectorRef.detectChanges();

		}

	}

	public getHours(day: DateTime) {
		// TODO type: minute, day, week, month
		return Array.from({length: this.rowsAmount}, (_, index) => {
			return day.plus({hours: index});
		});
	}
}
