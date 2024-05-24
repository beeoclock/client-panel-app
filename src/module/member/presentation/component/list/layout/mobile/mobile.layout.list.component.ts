import {Component, Input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {
    NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutListComponent} from "@utility/layout.list.component";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";
import {CardListComponent} from "@member/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {
    AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'member-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<RIMember> {

	@Input()
	public showButtonGoToForm = true;

	@ViewChildren(CardListComponent)
	public cardListComponents!: QueryList<CardListComponent>;
	openForm() {
		this.store.dispatch(new MemberActions.OpenForm());
	}

}
