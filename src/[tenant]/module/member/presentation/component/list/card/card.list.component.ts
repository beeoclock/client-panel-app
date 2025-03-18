import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import EMember from "@core/business-logic/member/entity/e.member";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	AutoRefreshButtonComponent
} from "@member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";

@Component({
	selector: 'member-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		AsyncPipe,
		CardComponent,
		CardIonListSmartComponent,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EMember> {

	public override open(item: EMember) {
		this.store.dispatch(new MemberActions.OpenDetails(item));
	}
	@Dispatch()
	public openForm() {
		return new MemberActions.OpenForm();
	}

}
