import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {KanbanOrderComponent} from "@tenant/order/order/presentation/ui/component/list/kanban/kanban.order.component";

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
})
export default class ListOrderPage extends ListPage implements OnDestroy, OnInit {

	public ngOnInit() {
		this.analyticsService.logEvent('order_list_page_initialized');
	}

	public ngOnDestroy() {
		this.store.dispatch(new OrderActions.Init());
	}

}
