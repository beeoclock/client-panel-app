import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";

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

	@Action(RolePresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IRolePresentationState>, {payload: id}: RolePresentationActions.OpenFormToEditById) {

		const title = this.translateService.instant('role.form.title.edit');
		const item = await this.sharedUow.role.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('RoleState.openDetailsById', 'Item not found');
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
}
