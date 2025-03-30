import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import EMember from "@core/business-logic/member/entity/e.member";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {MemberPresentationActions} from "@tenant/member/presentation/state/presentation/member.presentation.actions";

@Component({
	selector: 'member-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
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
		this.store.dispatch(new MemberPresentationActions.OpenDetails(item));
	}
	@Dispatch()
	public openForm() {
		return new MemberPresentationActions.OpenForm();
	}

}
