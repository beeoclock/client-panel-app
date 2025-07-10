import {Component, computed, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {IRole} from "@tenant/member/roles/domain";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {StateEnum} from "@core/shared/enum/state.enum";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {RoleDataActions} from "@tenant/member/roles/infrastructure/state/data/role.data.actions";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

@Component({
	selector: 'role-row-action-button-component',
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
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IRole.EntityRaw>();
	public readonly statusAsState = computed(() => {
		return this.item().state;
	});

	private readonly store = inject(Store);

	public activate() {
		this.setState(StateEnum.active);
	}

	public deactivate() {
		this.setState(StateEnum.inactive);
	}

	public delete() {
		this.setState(StateEnum.deleted);
	}

	public archive() {
		this.setState(StateEnum.archived);
	}

	@Dispatch()
	public setState(state: StateEnum) {
		const entity = ERole.fromRaw(this.item());
		return new RoleDataActions.SetState(entity, state);
	}

	public open() {
		this.store.dispatch(new RolePresentationActions.OpenDetails(this.item()));
	}

	public edit() {
		this.store.dispatch(new RolePresentationActions.OpenFormToEditById(this.id()));
	}
}
