import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {TableService} from "@utility/table.service";
import {OrderTableService} from "@order/presentation/component/list/order.table.service";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import EOrder from "@core/business-logic/order/entity/e.order";
import {KanbanOrderComponent} from "@order/presentation/component/list/kanban/kanban.order.component";

@Component({
	selector: 'app-list-order-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		// AsyncPipe,
		// ListOfCardCollectionByDateLayout,
		KanbanOrderComponent,
	],
	standalone: true,
	template: `
		<kanban-order/>
		<!--		<order-list-of-card-collection-by-date-layout-->
		<!--			[hidden]="initialized.isOff"-->
		<!--			[tableState]="tableState$ | async"/>-->

		<!--		@if (initialized.isOff) {-->

		<!--			<div class="p-4">-->
		<!--				{{ 'keyword.capitalize.initializing' | translate }}...-->
		<!--			</div>-->
		<!--		}-->

	`,
	providers: [
		{
			provide: TableService,
			useClass: OrderTableService
		}
	],
})
export default class ListOrderPage extends ListPage<EOrder> implements OnDestroy, OnInit {

	// public readonly tableState$: Observable<ITableState<EOrder>> = this.store.select(OrderState.tableState)
	// 	.pipe(
	// 		tap(() => {
	// 			this.changeDetectorRef.detectChanges();
	// 		})
	// 	);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('order_list_page_initialized');
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.store.dispatch(new OrderActions.Init());
	}

}
