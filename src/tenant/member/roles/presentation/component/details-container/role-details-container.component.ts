import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {
	RowActionButtonComponent
} from "@tenant/member/roles/presentation/component/row-action-button/row-action-button.component";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";

@Component({
	selector: 'role-detail-page',
	templateUrl: './role-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        RowActionButtonComponent,
        StandardDetailsEntityComponent,
    ],
	standalone: true
})
export class RoleDetailsContainerComponent {

	public readonly item = input.required<ERole | undefined>();

	public readonly store = inject(Store);

	public openForm() {
		const item = this.item();
		if (!item) {
			return
		}
		this.store.dispatch(new RolePresentationActions.OpenFormToEditById(item._id));
	}

}

export default RoleDetailsContainerComponent; 