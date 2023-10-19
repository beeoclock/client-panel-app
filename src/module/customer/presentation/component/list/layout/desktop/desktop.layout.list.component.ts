import {Component, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {ICustomer} from "@customer/domain";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";

@Component({
	selector: 'customer-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule,
	]
})
export class DesktopLayoutListComponent {

	@Input({required: true})
	public tableState!: ITableState<ICustomer> | null;

	@Input()
	public someDataExist = new BooleanState(false);

}
