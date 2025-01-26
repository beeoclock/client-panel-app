import {Component, input, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {
	AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {TableListComponent} from "@member/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'member-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		TableListComponent,
		AutoRefreshButtonComponent,
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<RIMember> {
	public override readonly tableState = input.required<ITableState<RIMember> | null>();
	openForm() {
		this.store.dispatch(new MemberActions.OpenForm());
	}
}
