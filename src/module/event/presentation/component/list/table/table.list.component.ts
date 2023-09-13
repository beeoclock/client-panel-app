import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {ITableState} from "@utility/domain/table.state";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {HumanizeDurationAdapter} from "@utility/adapter/humanize-duration.adapter";

@Component({
	selector: 'event-table-list-component',
	templateUrl: 'table.list.component.html',
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
		CurrencyPipe
	]
})
export class TableListComponent extends TableComponent {

	public override readonly actions = EventActions;

	@Input()
	public tableState!: ITableState<IEvent>;

	public readonly humanizeDurationAdapter = inject(HumanizeDurationAdapter);

}
