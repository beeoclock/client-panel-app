import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable, tap} from "rxjs";
import {MEvent, RMIEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
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
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import {EventRequestedActions} from "@event/state/event-requested/event-requested.actions";
import {
    ListOfCardCollectionByDateComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {IonicModule} from "@ionic/angular";

@Component({
	selector: 'app-event-requested-page',
	templateUrl: './requested.event.page.html',
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
		DesktopLayoutListComponent,
		ListOfCardCollectionByDateComponent,
		IonicModule
	],
	standalone: true
})
export default class RequestedEventPage extends ListPage {

	public override readonly actions = EventRequestedActions;

	public readonly tableState$: Observable<ITableState<RMIEvent>> = this.store.select(EventRequestedState.tableState)
		.pipe(
			map((tableState) => ({
				...tableState,
				items: tableState.items.map(MEvent.create),
			})),
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}
