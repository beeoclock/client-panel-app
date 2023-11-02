import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable, tap} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {MEvent, RMIEvent} from "@event/domain";
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
import {CardListComponent} from "@event/presentation/component/list/card/card.list.component";
import {MobileLayoutListComponent} from "@event/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@event/presentation/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'event-list-page',
	templateUrl: './index.html',
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
		NotFoundTableDataComponent,
		CardListComponent,
		MobileLayoutListComponent,
		DesktopLayoutListComponent
	],
	standalone: true
})
export default class Index extends ListPage<RMIEvent> {

	public override readonly actions = EventActions;

	public readonly tableState$: Observable<ITableState<RMIEvent>> = this.store.select(EventState.tableState)
		.pipe(
			map((tableState) => {
				return {
					...tableState,
					items: tableState.items.map(MEvent.create),
				}
			}),
			tap((tableState) => {
				if (this.someDataExist.isOff) {
					this.someDataExist.toggle(tableState.total > 0);
					this.changeDetectorRef.detectChanges();
				}
			})
		);

}
