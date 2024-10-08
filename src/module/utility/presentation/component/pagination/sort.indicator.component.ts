import {Component, Input} from "@angular/core";
import {ITableState} from "@utility/domain/table.state";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'utility-sort-indicator',
	standalone: true,
	imports: [
		IconComponent
	],
	template: `
		@if (tableState.orderBy === orderBy) {
			@switch (tableState.orderDir) {
				@case ('asc') {
					<app-icon name="bootstrapSortAlphaDown"/>
				}
				@case ('desc') {
					<app-icon name="bootstrapSortAlphaUp"/>
				}
			}
		}
	`
})
export class SortIndicatorComponent {
	@Input()
	public tableState!: ITableState<unknown>;

	@Input()
	public orderBy!: string;
}
