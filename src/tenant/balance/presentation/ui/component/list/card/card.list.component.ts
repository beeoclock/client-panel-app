import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {
	CardIonListSmartComponent
} from "@shared/presentation/ui/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/ui/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import {
	AutoRefreshButtonComponent
} from "@tenant/balance/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'balance-card-list-component',
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
		AutoRefreshButtonComponent,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EBalance> {

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: EBalance) {
		this.store.dispatch(new BalancePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new BalancePresentationActions.OpenForm();
	}

}
