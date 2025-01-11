import {Component, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";

import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ServiceActions} from "@service/state/service/service.actions";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Component({
	selector: 'service-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		TableListComponent,
		AutoRefreshButtonComponent,
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<IServiceDto> {

	openForm() {
		this.store.dispatch(new ServiceActions.OpenForm());
	}
}
