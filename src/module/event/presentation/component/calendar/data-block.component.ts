import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-calendar-data-block-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgIf
	],
	template: `
		<span
			class="text-xs text-blue-600 dark:text-sky-100"
			*ngIf="data.content?.headerHTML as headerHTML"
			[innerHTML]="headerHTML">
			</span>
		<span
			class="text-xs font-medium text-blue-600 dark:text-sky-100"
			*ngIf="data.content?.bodyHTML as bodyHTML"
			[innerHTML]="bodyHTML">
			</span>
		<span
			class="text-xs text-blue-600 dark:text-sky-100"
			*ngIf="data.content?.footerHTML as footerHTML"
			[innerHTML]="footerHTML">
			</span>
	`
})
export class DataBlockComponent implements OnChanges {

	@Input()
	public data!: {
		row: number;
		column: number;
		rowSpan?: number;
		content?: {
			headerHTML?: string;
			bodyHTML?: string;
			footerHTML?: string;
		};
	}

	@HostBinding()
	public class = 'bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg m-1 p-1 flex flex-col cursor-pointer';

	@HostBinding()
	public style = '';

	public ngOnChanges(changes: SimpleChanges & { data: { currentValue: DataBlockComponent['data'] } }) {
		if (changes.data) {
			this.style = `
				grid-row-start: ${this.data.row};
				grid-column-start: ${this.data.column};
				grid-row-end: ${this.data.row + (this.data.rowSpan ?? 1)};
				grid-column-end: ${this.data.column + 1};
			`;
		}
	}

}
