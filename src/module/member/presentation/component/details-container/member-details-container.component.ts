import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {MemberActions} from "@member/state/member/member.actions";
import {RIMember} from "@member/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";

@Component({
	selector: 'member-detail-page',
	templateUrl: './member-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        DeleteButtonComponent,
        EditButtonComponent,
        DynamicDatePipe,
    ],
	standalone: true
})
export class MemberDetailsContainerComponent {

	public readonly item = input<RIMember | null>(null);

	public readonly store = inject(Store);

	public delete(id: string): void {
		this.store.dispatch(new MemberActions.DeleteItem(id));
	}

	public openForm() {
		const item = this.item();
  if (!item) {
			return
		}
		this.store.dispatch(new MemberActions.OpenFormToEditById(item._id));
	}

}
