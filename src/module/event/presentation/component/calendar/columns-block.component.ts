import {
	ChangeDetectionStrategy,
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
import {DateTime} from "luxon";

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
			*ngFor="let header of preferences.header; let index = index">
			<!-- Columns Header -->
			<div
				class="h-[50px] bg-white test sticky top-0 z-10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
				{{ header?.content }}
			</div>
			<!-- Columns Body -->
			<ng-container *ngFor="let row of rows; let rowIndex = index">
				<event-calendar-cell-component
					[data]="header"
					[idSuffix]="row"
					[row]="rowIndex + 2"/>
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
		header: {
			id?: string;
			content?: string;
		}[];
	};

	// Build hours slots
	public readonly rows = Array.from({length: this.rowsAmount}, (_, index) => {
		return DateTime.now().startOf('day').plus({hours: index}).toFormat('HH:mm');
	});

	// Using outside of template
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public ngOnChanges(changes: SimpleChanges & {preferences: {currentValue: ColumnsBlockComponent['preferences']} }): void {

		const {preferences} = changes;

		if (preferences.currentValue) {

			const {header} = preferences.currentValue;

			if (header) {

				this.style += ` grid-template-columns: repeat(${header.length}, auto);`;
				this.style += ` min-width: calc(100% - 50px);`;

			}

		}

	}

}
