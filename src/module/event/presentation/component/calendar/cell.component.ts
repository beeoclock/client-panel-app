import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-calendar-cell-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgIf
	],
	template: `

	`
})
export class CellComponent implements OnChanges {

	@Input()
	public data!: {
		content?: string;
		id?: string;
	}

	@Input()
	public column: number = 0;

	@Input()
	public row: number = 0;

	@Input()
	public idSuffix = '';

	@HostBinding()
	public class = 'clickMe test border-slate-100 dark:border-slate-200/5 h-[50px]';

	@HostBinding()
	public style = '';

	@HostBinding()
	public id = '';

	public ngOnChanges(changes: SimpleChanges & { data: { currentValue: CellComponent['data'] } }) {
		if (changes.data) {
			this.id =  `${this.data.id}-${this.idSuffix}`;
		}
	}

}
