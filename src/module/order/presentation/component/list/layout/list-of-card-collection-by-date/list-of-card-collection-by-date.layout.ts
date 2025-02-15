import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnChanges,
	OnInit,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe} from "@angular/common";
import {DateTime} from "luxon";
import {TranslateModule} from "@ngx-translate/core";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {IOrderDto} from "../../../../../../../../core/business-logic/order/interface/details/i.order.dto";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	ListOfCardCollectionByDateComponent
} from "@order/presentation/component/list/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {ITableState} from "@utility/domain/table.state";
import {Actions, ofActionSuccessful} from '@ngxs/store';
import {OrderActions} from "@order/state/order/order.actions";

@Component({
	selector: 'order-list-of-card-collection-by-date-layout',
	templateUrl: './list-of-card-collection-by-date.layout.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
		ListOfCardCollectionByDateComponent,
		FilterComponent,
		TranslateModule
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ListOfCardCollectionByDateLayout extends LayoutListComponent<IOrderDto> implements OnChanges, OnInit {
	public override readonly tableState = input.required<ITableState<IOrderDto> | null>();

	public readonly mapOfItems: Map<string, IOrderDto[]> = new Map<string, IOrderDto[]>();
	public itemsWithDate: [string, IOrderDto[]][] = [];
	private previousTableState: ITableState<IOrderDto> | undefined;

	private readonly actions$ = inject(Actions);

	public ngOnInit() {
		// Handle store action on delete order
		this.actions$
			.pipe(
				this.takeUntil(),
				ofActionSuccessful(OrderActions.DeleteItem)
			).subscribe((result) => {
			this.mapOfItems.forEach((value, key) => {
				const index = value.findIndex((item) => item._id === result.payload);
				if (index !== -1) {
					value.splice(index, 1);
					this.mapOfItems.set(key, value);
					this.itemsWithDate = Array.from(this.mapOfItems.entries());
				}
			});
		});
	}

	public ngOnChanges(changes: SimpleChanges & { tableState: SimpleChange }) {

		this.ngxLogger.debug('ListOfCardCollectionByDateLayout:changes', changes);

		if (changes.tableState?.currentValue) {

			const currentTableState = changes.tableState.currentValue as ITableState<IOrderDto>;

			// Check if the tableState is not the same as the previous one
			if (JSON.stringify(this.previousTableState) === JSON.stringify(currentTableState)) {
				return;
			}

			if (currentTableState.page === 1) {
				this.mapOfItems.clear();
			}

			const {items} = currentTableState;
			items.forEach((item) => {
				const dateTime = DateTime.fromISO(item.createdAt);
				const dateKey = dateTime.toFormat('yyyy-MM-dd');
				this.mapOfItems.set(dateKey, (this.mapOfItems.get(dateKey) || []).concat(item));
			});
			this.itemsWithDate = Array.from(this.mapOfItems.entries());

			this.previousTableState = currentTableState as ITableState<IOrderDto>;

		}

		this.changeDetectorRef.detectChanges();

	}

}
