import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {RoleDetailsContainerComponent} from "@tenant/member/roles/presentation/component/details-container/role-details-container.component";
import {RoleFormContainerComponent} from "@tenant/member/roles/presentation/component/form/role-form-container/role-form-container.component";

import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

export type IRolePresentationState = object;

@State<IRolePresentationState>({
	name: 'rolePresentation',
	defaults: {},
})
@Injectable()
export class RolePresentationState {

	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	@Action(RolePresentationActions.CloseDetails)
	public async closeDetails() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(RolePresentationActions.CloseForm)
	public async closeForm() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(RolePresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IRolePresentationState>, {payload: id}: RolePresentationActions.OpenFormToEditById) {

		const title = this.translateService.instant('role.form.title.edit');
		const item = await this.sharedUow.role.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('RoleState.openDetailsById', 'Item not found');
			return;
		}

		await this.router.navigate([{outlets: {second: ['member', 'roles', id, 'edit']}}]);

	}

	@Action(RolePresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IRolePresentationState>, {payload: item}: RolePresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof RoleDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === item._id) {
					ctx.dispatch(new RolePresentationActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['member', 'roles', item._id]}}]);

	}

	@Action(RolePresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IRolePresentationState>, {payload}: RolePresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof RoleFormContainerComponent) {
				const isEditMode = (activated as any).isEditMode?.();
				if (isEditMode) {
					const {_id} = (activated as any).item?.() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new RolePresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new RolePresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['member', 'roles', payload.componentInputs.item?._id, 'edit']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['member', 'roles', 'create']}}]);
		}

	}
}
