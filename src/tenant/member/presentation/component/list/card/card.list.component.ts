import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import EMember from "@tenant/member/domain/entity/e.member";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {MemberPresentationActions} from "@tenant/member/infrastructure/state/presentation/member.presentation.actions";
import {MEMBER_CONFIG_CARD_LIST} from "@tenant/member/presentation/component/list/card/config.card.list.token";

@Component({
	selector: 'member-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
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

	public readonly config = inject(MEMBER_CONFIG_CARD_LIST, {optional: true,})

	public override open(item: EMember) {
		this.store.dispatch(new MemberPresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new MemberPresentationActions.OpenForm();
	}

}
