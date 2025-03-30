import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/customer/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'customer-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CardComponent,
		NoDataPipe,
		AsyncPipe,
		CardIonListSmartComponent,
		NotFoundTableDataComponent,
		AutoRefreshButtonComponent
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<ECustomer> {

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: ECustomer) {
		this.store.dispatch(new CustomerPresentationActions.OpenDetails(item));
	}
	@Dispatch()
	public openForm() {
		return new CustomerPresentationActions.OpenForm();
	}

}
