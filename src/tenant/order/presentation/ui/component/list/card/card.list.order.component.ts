import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {
	CardIonListSmartComponent
} from "@shared/presentation/component/smart/card-ion-list/card-ion-list.smart.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	CardItemLightweightOrderComponent
} from "@tenant/order/presentation/ui/component/list/card/item-lightweight/card.item.order.component";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import EOrder from "@tenant/order/domain/entity/e.order";
import {
	AutoRefreshButtonComponent
} from "@tenant/order/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'order-card-list-component',
	templateUrl: './card.list.order.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CardIonListSmartComponent,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		CardItemLightweightOrderComponent,
		AutoRefreshButtonComponent,
	],
	host: {
		class: 'block flex-1 p-2'
	},
})
export class CardListOrderComponent extends TableComponent<EOrder> {

	public override open(item: EOrder) {
		this.store.dispatch(new OrderActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
