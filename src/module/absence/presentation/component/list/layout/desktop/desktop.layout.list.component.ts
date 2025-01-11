import {Component, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
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

@Component({
	selector: 'app-absence-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<IAbsenceDto> {

	public openForm(): void {
		this.store.dispatch(new AbsenceActions.OpenForm());
	}

}
