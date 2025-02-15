import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {RIMember} from "@src/core/business-logic/member";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {CardListComponent} from "@member/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {
	AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'member-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<RIMember> {
	public override readonly tableState = input.required<ITableState<RIMember> | null>();
	public readonly showButtonGoToForm = input(true);

	readonly cardListComponents = viewChildren(CardListComponent);

	@Dispatch()
	public openForm() {
		return new MemberActions.OpenForm();
	}

}
