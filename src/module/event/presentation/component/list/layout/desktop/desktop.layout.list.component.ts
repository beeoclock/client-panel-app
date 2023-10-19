import {Component, Input, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardListComponent} from "@event/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TableListComponent} from "@event/presentation/component/list/table/table.list.component";
import {TranslateModule} from "@ngx-translate/core";
import {BooleanState} from "@utility/domain";
import {ITableState} from "@utility/domain/table.state";
import {IEvent} from "@event/domain";

@Component({
	selector: 'event-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule
	]
})
export class DesktopLayoutListComponent {

	@Input({required: true})
	public tableState!: ITableState<IEvent> | null;

	@Input()
	public someDataExist = new BooleanState(false);

}
