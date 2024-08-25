import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	DesktopLayoutListComponent
} from "@order/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {MobileLayoutListComponent} from "@order/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderState} from "@order/state/order/order.state";
import {
	ListOfCardCollectionByDateLayout
} from "@order/presentation/component/list/layout/list-of-card-collection-by-date/list-of-card-collection-by-date.layout";
import {TableService} from "@utility/table.service";
import {OrderTableService} from "@order/presentation/component/list/order.table.service";
import {OrderActions} from "@order/state/order/order.actions";

@Component({
	selector: 'app-list-order-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		StarterComponent,
		TranslateModule,
		FilterComponent,
		DropdownComponent,
		RouterLink,
		NgIf,
		AsyncPipe,
		PrimaryButtonDirective,
		NotFoundTableDataComponent,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
		ListOfCardCollectionByDateLayout,
		JsonPipe,
	],
	standalone: true,
	template: `
		<order-list-of-card-collection-by-date-layout
			[hidden]="initialized.isOff"
			[tableState]="tableState$ | async"/>
		<ng-template [ngIf]="initialized.isOff">
			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		</ng-template>

	`,
	providers: [
		{
			provide: TableService,
			useClass: OrderTableService
		}
	],
})
export default class ListOrderPage extends ListPage<IOrderDto> implements OnDestroy {

	public readonly tableState$: Observable<ITableState<IOrderDto>> = this.store.select(OrderState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('order_list_page_initialized');
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.store.dispatch(new OrderActions.Init());
	}

}
