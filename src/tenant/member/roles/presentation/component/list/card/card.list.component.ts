import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {
	CardIonListSmartComponent
} from "@shared/presentation/component/smart/card-ion-list/card-ion-list.smart.component";
import {
	AutoRefreshButtonComponent
} from "@tenant/member/roles/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";
import {ROLE_CONFIG_CARD_LIST} from "@tenant/member/roles/presentation/component/list/card/config.card.list.token";

@Component({
	selector: 'role-card-list-component',
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
export class CardListComponent extends TableComponent<ERole> {

	public readonly config = inject(ROLE_CONFIG_CARD_LIST, {optional: true,})

	public override open(item: ERole) {
		this.store.dispatch(new RolePresentationActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new RolePresentationActions.OpenForm();
	}

}
