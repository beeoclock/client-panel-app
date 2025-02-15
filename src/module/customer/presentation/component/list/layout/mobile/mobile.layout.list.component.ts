import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@customer/presentation/component/list/card/card.list.component";
import {ICustomer} from "@src/core/business-logic/customer";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@customer/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'customer-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<ICustomer.Entity> {

	public readonly showButtonGoToForm = input(true);
	public override readonly tableState = input.required<ITableState<ICustomer.Entity> | null>();

	readonly cardListComponents = viewChildren(CardListComponent);

	public openForm(): void {
		this.store.dispatch(new CustomerActions.OpenForm());
	}

	protected readonly open = open;
}
