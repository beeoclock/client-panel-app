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
import {ServiceActions} from "@service/state/service/service.actions";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {CardListComponent} from "@service/presentation/component/list/card/card.list.component";

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
		CardListComponent,
	],
})
export class DesktopLayoutListComponent extends LayoutListComponent<IServiceDto> {

	openForm() {
		this.store.dispatch(new ServiceActions.OpenForm());
	}
}
