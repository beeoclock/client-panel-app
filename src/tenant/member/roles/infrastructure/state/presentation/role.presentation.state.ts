import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";

import {Router} from "@angular/router";

import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import MemberDetailsContainerComponent
	from "@tenant/member/member/presentation/component/details-container/member-details-container.component";
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

	@Action(RolePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IRolePresentationState>, {payload}: RolePresentationActions.UpdateOpenedDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {

			if (activated instanceof MemberDetailsContainerComponent) {

				const {_id} = activated.item() ?? {};

				if (_id === payload._id) {

					await this.router.navigate([{outlets: {second: ['roles', payload._id]}}], {
						onSameUrlNavigation: 'reload',
					});

				}

			}

		}

	}

	@Action(RolePresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IRolePresentationState>, {payload}: RolePresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof MemberDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new RolePresentationActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['member', payload._id]}}]);

	}

	@Action(RolePresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IRolePresentationState>, {payload: id}: RolePresentationActions.OpenFormToEditById) {

		const title = this.translateService.instant('member.form.title.edit');
		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		const action = new RolePresentationActions.OpenForm({
			componentInputs: {
				item: item as any,
				isEditMode: true
			},
			pushBoxInputs: {
				title,
				id,
			}
		});

		ctx.dispatch(action)

	}

	@Action(RolePresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IRolePresentationState>, {payload}: RolePresentationActions.OpenForm): Promise<void> {

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['role', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['role', 'form']}}]);
		}

	}
}
