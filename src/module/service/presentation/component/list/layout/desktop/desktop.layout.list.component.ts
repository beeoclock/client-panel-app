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
import {IService} from "@src/core/business-logic/service/interface/i.service";

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
export class DesktopLayoutListComponent extends LayoutListComponent<IService.Entity> {

	openForm() {
		this.store.dispatch(new ServiceActions.OpenForm());
	}
}
