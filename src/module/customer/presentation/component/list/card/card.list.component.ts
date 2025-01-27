import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

@Component({
	selector: 'customer-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		CardComponent,
		NoDataPipe,
		AsyncPipe
	]
})
export class CardListComponent extends TableComponent<ICustomer> {

	// public override readonly actions = CustomerActions;

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: ICustomer) {
		this.store.dispatch(new CustomerActions.OpenDetails(item));
	}

}
