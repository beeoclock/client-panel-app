import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {IOrderDto} from "../../../../core/business-logic/order/interface/details/i.order.dto";
import {OrderState} from "@order/infrastructure/state/order/order.state";
import {TableService} from "@utility/table.service";
import {OrderTableService} from "@order/presentation/component/list/order.table.service";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {
	ListOfCardCollectionByDateLayout
} from "@order/presentation/component/list/layout/list-of-card-collection-by-date/list-of-card-collection-by-date.layout";

@Component({
	selector: 'app-list-order-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		ListOfCardCollectionByDateLayout,
	],
	standalone: true,
	template: `
		<order-list-of-card-collection-by-date-layout
			[hidden]="initialized.isOff"
			[tableState]="tableState$ | async"/>

		@if (initialized.isOff) {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}

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
			tap(() => {
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
