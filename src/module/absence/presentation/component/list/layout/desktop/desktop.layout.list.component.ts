import {Component, effect, input, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import {TableListComponent} from "@absence/presentation/component/list/table/table.list.component";
import {
	AutoRefreshButtonComponent
} from "@absence/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ITableState} from "@utility/domain/table.state";

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
export class DesktopLayoutListComponent extends LayoutListComponent<IAbsenceDto> {
	public override readonly tableState = input.required<ITableState<IAbsenceDto> | null>();

	public constructor() {
		super();
		effect(() => {
			console.log('effect', this.tableState());
		})
	}

	@Dispatch()
	public openForm() {
		return new AbsenceActions.OpenForm()
	}

}
