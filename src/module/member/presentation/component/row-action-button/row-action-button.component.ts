import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {RIMember} from "@member/domain";
import {MemberActions} from "@member/state/member/member.actions";

@Component({
	selector: 'member-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action [id]="id" (delete)="delete($event)" (open)="open()" (edit)="edit()">
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

	@Input()
	public id!: string;

	@Input({required: true})
	public item!: RIMember;

	private readonly store = inject(Store);

	public delete(id: string): void {
		this.store.dispatch(new MemberActions.DeleteItem(id));
	}

	public async archive(id: string): Promise<void> {
		await firstValueFrom(this.store.dispatch(
			new MemberActions.ArchiveItem(id)));
	}

	public open() {
		this.store.dispatch(new MemberActions.OpenDetailsById(this.id));
	}

	public edit() {
		this.store.dispatch(new MemberActions.OpenFormToEditById(this.id));
	}
}
