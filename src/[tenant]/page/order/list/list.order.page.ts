import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {TableService} from "@utility/table.service";
import {OrderTableService} from "@order/presentation/component/list/order.table.service";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import EOrder from "@core/business-logic/order/entity/e.order";
import {KanbanOrderComponent} from "@order/presentation/component/list/kanban/kanban.order.component";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {MemberTableNgxDatatableSmartResource} from "@page/member/list/member.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-order-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		KanbanOrderComponent,
	],
	standalone: true,
	template: `
		<kanban-order/>

	`,
	providers: [
		{
			provide: TableService,
			useClass: OrderTableService
		},
		{
			provide: TableNgxDatatableSmartResource,
			useClass: MemberTableNgxDatatableSmartResource,
		},
	],
})
export default class ListOrderPage extends ListPage<EOrder> implements OnDestroy, OnInit {

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('order_list_page_initialized');
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.store.dispatch(new OrderActions.Init());
	}

}
