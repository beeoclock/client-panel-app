import {Component, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";

import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import EService from "@core/business-logic/service/entity/e.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'service-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
		TableListComponent,
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<EService> {

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}
}
