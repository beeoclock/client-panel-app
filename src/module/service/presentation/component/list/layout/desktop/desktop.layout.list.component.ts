import {Component, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardListComponent} from "@event/presentation/component/list/card/card.list.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import {IService} from "@service/domain";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";

@Component({
	selector: 'service-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		TableListComponent,
	]
})
export class DesktopLayoutListComponent {

	@Input({required: true})
	public tableState!: ITableState<IService> | null;

	@Input()
	public someDataExist = new BooleanState(false);

}
