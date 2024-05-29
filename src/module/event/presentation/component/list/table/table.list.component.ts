import {Component, ViewEncapsulation} from "@angular/core";
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
export class TableListComponent extends TableComponent<IEvent> {

	public override readonly actions = EventActions;

	public readonly tableConfiguration = {
		columns: {
			service: {
				style: {
					minWidth: '350px',
					flexGrow: 1,
				},
			},
			attendants: {
				style: {
					minWidth: '100px',
				},
			},
			duration: {
				style: {
					minWidth: '120px',
				},
			},
			price: {
				style: {
					minWidth: '150px',
				},
			},
			start: {
				style: {
					minWidth: '200px',
				},
			},
			end: {
				style: {
					minWidth: '220px',
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
				classList: ['bg-white', 'justify-center'],
				style: {
					minWidth: '75px',
				},
			},
		},
	};

	public delete(id: string): void {
		this.store.dispatch(new EventActions.DeleteItem(id));
	}

	public override open(id: string): void {
		console.log('open', id)
		// this.store.dispatch(new EventActions.OpenDetailsById(id));
	}

	public edit(id: string): void {
		this.store.dispatch(new EventActions.OpenFormToEditById(id));
	}

}
