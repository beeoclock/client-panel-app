import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {MemberActions} from "@member/state/member/member.actions";
import {RIMember} from "@member/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";

@Component({
	selector: 'member-detail-page',
	templateUrl: './member-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        NgIf,
        DeleteButtonComponent,
        EditButtonComponent,
        DynamicDatePipe,
        ActiveStyleDirective
    ],
	standalone: true
})
export class MemberDetailsContainerComponent {

	@Input()
	public readonly item: RIMember | null = null;

	public readonly store = inject(Store);

	public delete(id: string): void {
		this.store.dispatch(new MemberActions.DeleteItem(id));
	}

	public openForm() {
		if (!this.item) {
			return
		}
		this.store.dispatch(new MemberActions.OpenFormToEditById(this.item._id));
	}

}
