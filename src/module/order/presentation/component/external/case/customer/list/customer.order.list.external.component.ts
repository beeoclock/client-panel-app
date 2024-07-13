import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	QueryList,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ITableState, TableState} from "@utility/domain/table.state";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
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
import {tap} from "rxjs";
import {
	DesktopLayoutListComponent
} from "@order/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {ListPage} from "@utility/list.page";
import {PeerCustomerOrderState} from "@order/state/peer-customer/peer-customer.order.state";
import {MobileLayoutListComponent} from "@order/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {
	CustomerOrderTableService
} from "@order/presentation/component/external/case/customer/list/customer.order.table.service";

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
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerOrderTableService
		}
	]
})
export class CustomerOrderListExternalComponent extends ListPage implements OnInit {

	@Input({required: true})
	public customerId!: string;

	@Input()
	public useTableStateFromStore = true;

	@Input()
	public tableState: ITableState<IOrderDto> = new TableState<IOrderDto>().toCache();

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	public override mobileMode = true;

	public override ngOnInit() {
		super.ngOnInit();
		this.store.select(PeerCustomerOrderState.tableState)
			.pipe(
				this.takeUntil(),
				tap((tableState) => {
					if (this.useTableStateFromStore) {
						this.tableState = tableState;
						this.changeDetectorRef.detectChanges();
					}
				})
			).subscribe();
	}

}
