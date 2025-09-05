import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/ui/component/not-found-table-data/not-found-table-data.component";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {
	OrderServicePresentationActions
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.actions";
import {
	AutoRefreshButtonComponent
} from "@tenant/order/payment/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import {
	CardIonListSmartComponent
} from "@shared/presentation/ui/component/smart/card-ion-list/card-ion-list.smart.component";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {
	LightweightOrderServiceCardMolecule
} from "@tenant/order/order-service/presentation/ui/molecule/lightweight-order-service-card/lightweight-order-service-card.molecule";

@Component({
	selector: 'order-service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
		CardIonListSmartComponent,
		LightweightOrderServiceCardMolecule,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EOrderService> {

	public override open(item: EOrderService) {
		this.store.dispatch(new OrderServicePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
