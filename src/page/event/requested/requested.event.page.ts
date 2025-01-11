import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {map, Observable, tap} from "rxjs";
import {MEvent, RMIEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
import {NgIf} from "@angular/common";
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
		TranslateModule,
		NgIf,
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
