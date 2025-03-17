import {Component, input, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {
	AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {TableListComponent} from "@member/presentation/component/list/table/table.list.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {ITableState} from "@utility/domain/table.state";
import EMember from "@core/business-logic/member/entity/e.member";

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
	],
	host: {

		class: 'flex flex-col overflow-hidden h-full',
	}
})
export class DesktopLayoutListComponent extends LayoutListComponent<EMember> {
	public override readonly tableState = input.required<ITableState<EMember> | null>();

	public openForm() {
		this.store.dispatch(new MemberActions.OpenForm());
	}
}
