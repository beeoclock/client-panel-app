import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnChanges,
	QueryList,
	SimpleChange,
	SimpleChanges,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ITableState, TableState} from "@utility/domain/table.state";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {DateTime} from "luxon";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import {
	ListOfCardCollectionByDateComponent
} from "@order/presentation/component/list/list-of-card-collection-by-date/list-of-card-collection-by-date.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

@Component({
    selector: 'order-external-list-component',
    templateUrl: './customer.order.list.external.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        NgIf,
        TranslateModule,
        AutoRefreshButtonComponent,
        FilterComponent,
        ListOfCardCollectionByDateComponent,
        NotFoundTableDataComponent,
    ],
    standalone: true
})
export class CustomerOrderListExternalComponent implements OnChanges {

    @Input()
    public useTableStateFromStore = true;

    @Input()
    public tableState: ITableState<IOrderDto> = new TableState<IOrderDto>().toCache();

    @ViewChildren(MobileLayoutListComponent)
    public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

    public items: { [key: string]: { [key: string]: IOrderDto[] } } = {};

    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public ngOnChanges(changes: SimpleChanges & { tableState: SimpleChange }) {

        if (changes.tableState?.currentValue) {
            const {items} = changes.tableState.currentValue as { items: IOrderDto[] };
            this.items = {};
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
            }, this.items);
        }
        this.changeDetectorRef.detectChanges();

    }
    //
    // public override ngOnInit() {
    //     super.ngOnInit();
    //     this.store.select(OrderState.tableState)
    //         .pipe(
    //             this.takeUntil(),
    //             tap((tableState) => {
    //                 if (this.useTableStateFromStore) {
    //                     this.tableState = tableState;
    //                     this.changeDetectorRef.detectChanges();
    //                 }
    //             })
    //         ).subscribe();
    // }

}
