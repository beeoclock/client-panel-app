import {Directive, ElementRef, forwardRef, HostBinding, Inject, Input, OnInit} from "@angular/core";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";

@Directive({
	selector: '[tableColumnFlex]',
	standalone: true,
})
export class ColumnTableFlexDirective implements OnInit {

	@Input()
	public tableColumnFlex: string | undefined;

	constructor(
		@Inject(forwardRef(() => TableTableFlexDirective))
		private readonly table: TableTableFlexDirective,
		@Inject(forwardRef(() => RowTableFlexDirective))
		private readonly row: RowTableFlexDirective,
		private readonly element: ElementRef<HTMLElement>,
	) {
	}

	@HostBinding()
	public class = [
		'px-2',
		'py-4',
		'whitespace-nowrap',

		'border-b',
		'border-beeColor-300',
		'dark:border-beeDarkColor-700',
	];

	public ngOnInit() {

		switch (this.row.tableRowFlex) {
			case 'body':
				this.class.push('flex', 'items-center');
				break;
		}

		if (this.table.tableFlex) {
			const columns = this.table.tableFlex.columns;
			const column = columns[this.tableColumnFlex as string];
			if (column) {
				if (column.classList) {
					this.class.push(...column.classList);
				}
				if (column.style) {
					Object.assign(this.element.nativeElement.style, column.style);
				}
			}
		}

	}

}
