import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, tap} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
import {EventState} from "@event/state/event/event.state";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
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
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

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
		RouterLink,
		CurrencyPipe,
		NgForOf,
		StarterComponent,
		TableListComponent,
		NgIf,
		NotFoundTableDataComponent
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = EventActions;

	public readonly tableState$: Observable<ITableState<IEvent>> = this.store.select(EventState.tableState)
		.pipe(
			tap((tableState) => {
				if (this.someDataExist.isOff) {
					this.someDataExist.toggle(tableState.total > 0);
					this.changeDetectorRef.detectChanges();
				}
			})
		);

}
