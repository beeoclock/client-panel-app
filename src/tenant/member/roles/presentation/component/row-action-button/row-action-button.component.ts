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
import {ToastController} from "@ionic/angular/standalone";
import {TranslateService} from "@ngx-translate/core";

@Component({
	selector: 'role-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			[id]="id()"
			[hide]="computedHide()"
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
	private readonly toastController = inject(ToastController);
	private readonly translate = inject(TranslateService);

	public readonly computedHide = computed(() => {
		const allowed: ('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[] = ['details', 'edit', 'delete', 'activate', 'deactivate'];
		let base = (this.hide() ?? []).filter((x): x is typeof allowed[number] => allowed.includes(x as any));
		if (this.item()?.isOwner && !base.includes('delete')) {
			base = [...base, 'delete'];
		}
		return base;
	});

	public activate() {
		this.setState(StateEnum.active);
	}

	public deactivate() {
		this.setState(StateEnum.inactive);
	}

	public async delete() {
		if (this.item()?.isOwner) {
			const toast = await this.toastController.create({
				message: this.translate.instant('role.toast.cannotDeleteOwner'),
				color: 'warning',
				duration: 4000,
				position: 'top',
			});
			await toast.present();
			return;
		}

		const question = this.translate.instant('role.action.delete.question');
		if (!confirm(question)) {
			return;
		}

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
