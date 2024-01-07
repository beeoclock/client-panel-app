import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges
} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {DataBlockComponent} from "@event/presentation/component/calendar/data-block.component";
import {CellComponent} from "@event/presentation/component/calendar/cell.component";

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
		<!-- Columns Header -->
		<div
			*ngFor="let header of preferences.header; let index = index"
			class="bg-white row-start-[1] col-start-[{{ index + 1 }}] test sticky top-0 z-10 dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 bg-clip-padding text-slate-900 dark:text-slate-200 border-b text-sm font-medium py-2 text-center">
			{{ header?.content }}
		</div>
		<!-- Columns Body -->
		<ng-container *ngFor="let row of rows;">
			<event-calendar-cell-component
				*ngFor="let header of preferences.header; let column = index"
				[data]="header"
				[idSuffix]="'' + (row - 2)"
				[row]="row"
				[column]="column"/>
		</ng-container>
	`
})
export class ColumnsBlockComponent implements OnChanges, OnInit {

	@HostBinding()
	public class = '[&>*]:border-b [&>*]:border-neutral-200 [&>*]:border-r hover:[&>.clickMe]:!bg-blue-100 grid';

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

	// +2 because we already have rows in header
	public readonly rows = Array.from({length: this.rowsAmount}, (_, index) => index + 2);

	// Using outside of template
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public ngOnInit() {
		this.style += ` grid-template-rows: repeat(${this.rowsAmount + 1}, 50px);`;
	}

	public ngOnChanges(changes: SimpleChanges & {preferences: {currentValue: ColumnsBlockComponent['preferences']} }): void {

		const {preferences} = changes;

		if (preferences.currentValue) {

			const {header} = preferences.currentValue;

			console.log('header', header);

			if (header) {

				this.style += ` grid-template-columns: repeat(${header.length}, auto);`;
				this.style += ` min-width: calc(100% - 50px);`;

			}

		}

	}

}
