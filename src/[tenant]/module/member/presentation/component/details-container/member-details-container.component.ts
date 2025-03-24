import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {NgOptimizedImage} from "@angular/common";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {MemberPresentationActions} from "@member/presentation/state/presentation/member.presentation.actions";

@Component({
	selector: 'member-detail-page',
	templateUrl: './member-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		DynamicDatePipe,
		NgOptimizedImage,
		RowActionButtonComponent,
	],
	standalone: true
})
export class MemberDetailsContainerComponent {

	@Input({required: true})
	public readonly item!: IMember.EntityRaw;

	public readonly store = inject(Store);

	public openForm() {
		const item = this.item;
		if (!item) {
			return
		}
		this.store.dispatch(new MemberPresentationActions.OpenFormToEditById(item._id));
	}

}
