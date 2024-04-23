import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardListComponent} from "@event/presentation/component/list/card/card.list.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableListComponent} from "@service/presentation/component/list/table/table.list.component";
import {IService} from "@service/domain";
import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import {LayoutListComponent} from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ServiceActions} from "@service/state/service/service.actions";

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
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<IService> {

	openForm() {
		this.store.dispatch(new ServiceActions.OpenForm());
	}
}
