import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {NgOptimizedImage} from "@angular/common";
import {
	RowActionButtonComponent
} from "@tenant/member/member/presentation/component/row-action-button/row-action-button.component";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";
import EMember from "@tenant/member/member/domain/entity/e.member";
import {
	StandardDetailsEntityComponent
} from "@shared/presentation/ui/component/entity/standard-details.entity.component";

@Component({
	selector: 'member-detail-page',
	templateUrl: './member-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        NgOptimizedImage,
        RowActionButtonComponent,
        StandardDetailsEntityComponent,
    ],
	standalone: true
})
export class MemberDetailsContainerComponent {

	public readonly item = input.required<EMember>();

	public readonly store = inject(Store);

	public openForm() {
		const item = this.item();
		if (!item) {
			return
		}
		this.store.dispatch(new MemberPresentationActions.OpenFormToEditById(item._id));
	}

}

export default MemberDetailsContainerComponent;
