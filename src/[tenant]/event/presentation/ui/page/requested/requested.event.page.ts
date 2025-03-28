import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable, tap} from "rxjs";
import {MEvent, RMIEvent} from "@[tenant]/event/domain";
import {ITableState} from "@utility/domain/table.state";
import {EventRequestedState} from "@[tenant]/event/presentation/state/event-requested/event-requested.state";
import {
	ListOfCardCollectionByDateComponent
} from "@[tenant]/event/presentation/ui/component/requsted/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {TableService} from "@utility/table.service";
import {
	RequestedEventTableService
} from "@[tenant]/event/presentation/ui/component/requsted/requested.event.table.service";

@Component({
	selector: 'app-event-requested-page',
	templateUrl: './requested.event.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		ListOfCardCollectionByDateComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: RequestedEventTableService
		}
	]
})
export default class RequestedEventPage extends ListPage<RMIEvent> {

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
