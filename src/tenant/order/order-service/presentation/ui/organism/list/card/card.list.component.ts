import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/payment/presentation/ui/molecule/button/auto-refresh/auto-refresh.button.component";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {
	OrderServicePresentationActions
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.actions";

@Component({
	selector: 'order-service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CardComponent,
		CardIonListSmartComponent,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent,
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
		return new OrderServicePresentationActions.OpenForm();
	}

}
