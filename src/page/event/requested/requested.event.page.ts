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
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import {
	ListOfCardCollectionByDateComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {IonicModule} from "@ionic/angular";
import {TableService} from "@utility/table.service";
import {RequestedEventTableService} from "@event/presentation/component/requsted/requested.event.table.service";

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
		DropdownComponent,
		AsyncPipe,
		RouterLink,
		CurrencyPipe,
		NgForOf,
		StarterComponent,
		NgIf,
		NotFoundTableDataComponent,
		ListOfCardCollectionByDateComponent,
		IonicModule
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: RequestedEventTableService
		}
	]
})
export default class RequestedEventPage extends ListPage {

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
