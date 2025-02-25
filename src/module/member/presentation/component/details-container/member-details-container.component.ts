import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {NgOptimizedImage} from "@angular/common";
import {RowActionButtonComponent} from "@member/presentation/component/row-action-button/row-action-button.component";
import {IMember} from "@core/business-logic/member/interface/i.member";

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
		this.store.dispatch(new MemberActions.OpenFormToEditById(item._id));
	}

}
