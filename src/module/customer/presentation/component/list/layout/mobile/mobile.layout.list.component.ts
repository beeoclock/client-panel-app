import {Component, inject, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@customer/presentation/component/list/card/card.list.component";
import {ICustomer} from "@customer/domain";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@customer/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ITableState} from "@utility/domain/table.state";
import ECustomer from "@core/entity/e.customer";

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
export class MobileLayoutListComponent extends LayoutListComponent<ICustomer> {

	public readonly showButtonGoToForm = input(true);
	public override readonly tableState = input.required<ITableState<ICustomer> | null>();

	readonly cardListComponents = viewChildren(CardListComponent);
	private readonly customerStore = inject(ECustomer.store);

	public openForm(): void {
		// this.store.dispatch(new CustomerActions.OpenForm());
		this.customerStore.openForm();
	}

	protected readonly open = open;
}
