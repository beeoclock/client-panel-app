import {Component, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {CardListComponent} from "@customer/presentation/component/list/card/card.list.component";
import {ICustomer} from "@customer/domain";

@Component({
	selector: 'customer-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		CardListComponent
	]
})
export class MobileLayoutListComponent {

	@Input({required: true})
	public tableState!: ITableState<ICustomer> | null;

	@Input()
	public someDataExist = new BooleanState(false);

}
