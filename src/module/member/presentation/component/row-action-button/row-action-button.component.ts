import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {IMember} from "@core/business-logic/member/interface/i.member";

@Component({
	selector: 'member-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			[id]="id()"
			[hide]="hide()"
			(open)="open()"
			(edit)="edit()">
			<!--			<li>-->
			<!--				<a-->
			<!--					[routerLink]="['../../', 'event', 'form']"-->
			<!--					[queryParams]="{serviceId: item._id, returnUrl}"-->
			<!--					class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
			<!--					<i class="bi bi-calendar2-week"></i>-->
			<!--					{{ 'keyword.capitalize.add-event' | translate }}-->
			<!--				</a>-->
			<!--			</li>-->
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IMember.EntityRaw>();

	private readonly store = inject(Store);

	public async archive(id: string): Promise<void> {
		await firstValueFrom(this.store.dispatch(
			new MemberActions.ArchiveItem(id)));
	}

	public open() {
		this.store.dispatch(new MemberActions.OpenDetails(this.item()));
	}

	public edit() {
		this.store.dispatch(new MemberActions.OpenFormToEditById(this.id()));
	}
}
