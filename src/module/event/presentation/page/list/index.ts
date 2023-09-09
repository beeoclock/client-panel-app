import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
import {EventState} from "@event/state/event/event.state";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TableListComponent} from "@event/presentation/component/list/table/table.list.component";

@Component({
	selector: 'event-list-page',
	templateUrl: 'index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DynamicDatePipe,
		EventStatusStyleDirective,
		ActionComponent,
		TableStatePaginationComponent,
		SortIndicatorComponent,
		TranslateModule,
		FilterComponent,
		DropdownComponent,
		AsyncPipe,
		NgIf,
		RouterLink,
		CurrencyPipe,
		NgForOf,
		StarterComponent,
		TableListComponent
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = EventActions;

	@Select(EventState.tableState)
	public readonly tableState$!: Observable<ITableState<IEvent>>;

}
