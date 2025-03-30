import {Component, computed, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {StateEnum} from "@core/shared/enum/state.enum";
import EMember from "@core/business-logic/member/entity/e.member";
import {MemberProfileStatusEnum} from "@core/business-logic/member/enums/member-profile-status.enum";
import {MemberDataActions} from "@tenant/member/presentation/state/data/member.data.actions";
import {MemberPresentationActions} from "@tenant/member/presentation/state/presentation/member.presentation.actions";

@Component({
	selector: 'member-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			[id]="id()"
			[hide]="hide()"
			[state]="statusAsState()"
			(open)="open()"
			(delete)="delete()"
			(deactivate)="deactivate()"
			(activate)="activate()"
			(archive)="archive()"
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
	public readonly statusAsState = computed(() => {
		switch (this.item().profileStatus) {
			case MemberProfileStatusEnum.active:
				return StateEnum.active;
			default:
				return StateEnum.inactive;
		}
	});

	private readonly store = inject(Store);

	public activate() {
		// this.setState(StateEnum.active);
		this.setStatus(MemberProfileStatusEnum.active);
	}

	public deactivate() {
		// this.setState(StateEnum.inactive);
		this.setStatus(MemberProfileStatusEnum.suspended);
	}

	public delete() {
		this.setStatus(MemberProfileStatusEnum.deleted);
		// this.setState(StateEnum.deleted);
	}

	public archive() {
		this.setState(StateEnum.archived);
	}

	@Dispatch()
	public setState(state: StateEnum) {
		const entity = EMember.fromRaw(this.item());
		return new MemberDataActions.SetState(entity, state);
	}

	@Dispatch()
	public setStatus(status: MemberProfileStatusEnum) {
		const entity = EMember.fromRaw(this.item());
		return new MemberDataActions.SetStatus(entity, status);
	}

	public open() {
		this.store.dispatch(new MemberPresentationActions.OpenDetails(this.item()));
	}

	public edit() {
		this.store.dispatch(new MemberPresentationActions.OpenFormToEditById(this.id()));
	}
}
