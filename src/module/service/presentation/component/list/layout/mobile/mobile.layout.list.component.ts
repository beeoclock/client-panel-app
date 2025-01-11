import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@service/presentation/component/list/card/card.list.component";

import {FilterComponent} from "@service/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ServiceActions} from "@service/state/service/service.actions";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'service-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IServiceDto> {

	public readonly showButtonGoToForm = input(true);

	public override readonly tableState = input.required<ITableState<IServiceDto> | null>();
	public readonly cardListComponents = viewChildren(CardListComponent);

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}

}
