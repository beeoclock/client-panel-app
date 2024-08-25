import {
	ChangeDetectionStrategy,
	Component,
	OnChanges,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FirstKeyNameModule} from "@utility/presentation/pipes/first-key-name/first-key-name.module";
import {DateTime} from "luxon";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	ChangeStatusOnAcceptedComponent
} from "@event/presentation/component/change-status/change-status-on-accepted.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {
	ChangeStatusOnRejectedComponent
} from "@event/presentation/component/change-status/change-status-on-rejected.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {
	AttendeeCardComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/attendee-card/attendee.card.component";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TableListComponent} from "@order/presentation/component/list/table/table.list.component";
import {CardItemOrderComponent} from "@order/presentation/component/list/card/item/card.item.order.component";
import {
	ListOfCardCollectionByDateComponent
} from "@order/presentation/component/list/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'order-list-of-card-collection-by-date-layout',
	templateUrl: './list-of-card-collection-by-date.layout.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgForOf,
		AsyncPipe,
		FirstKeyNameModule,
		KeyValuePipe,
		NgIf,
		CardComponent,
		ActionComponent,
		ChangeStatusOnAcceptedComponent,
		CurrencyPipe,
		DatePipe,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		NoDataPipe,
		TranslateModule,
		ChangeStatusOnRejectedComponent,
		AttendeeCardComponent,
		FilterComponent,
		FilterComponent,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TableListComponent,
		CardItemOrderComponent,
		ListOfCardCollectionByDateComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ListOfCardCollectionByDateLayout extends LayoutListComponent<IOrderDto> implements OnChanges {

	public readonly mapOfItems: Map<string, IOrderDto[]> = new Map<string, IOrderDto[]>();
	public itemsWithDate: [string, IOrderDto[]][] = [];
	private previousTableState: ITableState<IOrderDto> | undefined;

	public ngOnChanges(changes: SimpleChanges & { tableState: SimpleChange }) {

		this.ngxLogger.debug('ListOfCardCollectionByDateLayout:changes', changes);

		if (changes.tableState?.currentValue) {

			const currentTableState = changes.tableState.currentValue as ITableState<IOrderDto>;

			console.log({
				currentTableState,
				previousTableState: this.previousTableState
			})

			// Check if the tableState is not the same as the previous one
			if (this.previousTableState && this.previousTableState.page === currentTableState.page && this.previousTableState.items.length === currentTableState.items.length) {
				console.log('Same page');
				return;
			}

			const {items} = currentTableState;
			items.forEach((item) => {
				const dateTime = DateTime.fromISO(item.createdAt);
				const dateKey = dateTime.toFormat('yyyy-MM-dd');
				this.mapOfItems.set(dateKey, (this.mapOfItems.get(dateKey) || []).concat(item));
			});
			this.itemsWithDate = Array.from(this.mapOfItems.entries());
			console.log('this.itemsWithDate', this.itemsWithDate)

			this.previousTableState = currentTableState as ITableState<IOrderDto>;

		}

		this.changeDetectorRef.detectChanges();

	}

}
