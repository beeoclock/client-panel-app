import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {ITableState} from "@utility/domain/table.state";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";

@Component({
	selector: 'event-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		ActionComponent,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		CurrencyPipe,
		HumanizeDurationPipe,
		TableTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		BodyTableFlexDirective
	]
})
export class TableListComponent extends TableComponent {

	public override readonly actions = EventActions;

	@Input()
	public tableState!: ITableState<IEvent>;

	public readonly tableConfiguration = {
		columns: {
			attendants: {
				style: {
					minWidth: '100px',
				},
			},
			service: {
				style: {
					minWidth: '250px',
				},
			},
			duration: {
				style: {
					minWidth: '120px',
				},
			},
			price: {
				style: {
					minWidth: '100px',
				},
			},
			start: {
				style: {
					minWidth: '200px',
				},
			},
			end: {
				style: {
					minWidth: '200px',
				},
			},
			status: {
				style: {
					minWidth: '150px',
				},
			},
			createdAt: {
				style: {
					minWidth: '250px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '250px',
				},
			},
			action: {
				style: {
					minWidth: '80px',
				},
			},
		},
	};

}
