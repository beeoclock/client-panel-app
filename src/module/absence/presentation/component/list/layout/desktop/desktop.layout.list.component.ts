import {Component, input, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import {TableListComponent} from "@absence/presentation/component/list/table/table.list.component";
import {
	AutoRefreshButtonComponent
} from "@absence/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ITableState} from "@utility/domain/table.state";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Component({
	selector: 'app-absence-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<EAbsence> {
	public override readonly tableState = input.required<ITableState<EAbsence> | null>();

	@Dispatch()
	public openForm() {
		return new AbsenceActions.OpenForm()
	}

}
