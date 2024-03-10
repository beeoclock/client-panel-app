import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";

@Component({
	selector: 'event-cell-component',
	template: `
		<div class="opacity-0 hover:opacity-100 transition-all flex items-center h-full px-2 cursor-pointer bg-neutral-100 active:bg-blue-400 active:text-white text-neutral-500">
			+ Dodaj
		</div>
	`,
	standalone: true,
	encapsulation: ViewEncapsulation.None
})
export class CellComponent {

	@Input()
	public rowIndex!: number;

	@Input()
	public columnIndex!: number;

	@Input()
	public row!: {
		isFirstOrLastRowOfHour: boolean;
	};

	@Input()
	public column!: {
		member: Member.RIMember | null;
	};

	@HostBinding('style.grid-row-start')
	public get gridRowStart() {
		return this.rowIndex + 2;
	}

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.columnIndex + 1;
	}

	@HostBinding()
	public get class() {
		return 'border-slate-100 dark:border-slate-200/5 border-r';
	}

	@HostBinding('class.border-b')
	public get borderB() {
		return this.row.isFirstOrLastRowOfHour;
	}

}
