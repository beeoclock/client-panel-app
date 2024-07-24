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
import {LayoutListComponent} from "@utility/layout.list.component";
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

	public items: { [key: string]: { [key: string]: IOrderDto[] } } = {};

	public ngOnChanges(changes: SimpleChanges & { tableState: SimpleChange }) {

		if (changes.tableState?.currentValue) {
			const {items} = changes.tableState.currentValue as { items: IOrderDto[] };
			this.items = items.reduce((acc, item) => {
				const dateTime = DateTime.fromISO(item.createdAt);
				const dateKey = dateTime.toFormat('yyyy-MM-dd');
				const timeKey = dateTime.toFormat('HH:mm');
				const dateGroup = acc[dateKey] ?? {};
				const timeGroup = dateGroup[timeKey] ?? [];
				timeGroup.push(item);
				dateGroup[timeKey] = timeGroup;
				acc[dateKey] = dateGroup;
				return acc;
			}, {} as { [key: string]: { [key: string]: IOrderDto[] } });
		}
		this.changeDetectorRef.detectChanges();

	}

}
