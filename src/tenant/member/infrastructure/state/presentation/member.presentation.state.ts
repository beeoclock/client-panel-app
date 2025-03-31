import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {MemberPresentationActions} from "@tenant/member/infrastructure/state/presentation/member.presentation.actions";
import {Router} from "@angular/router";
import {
	AbsencePresentationActions
} from "@tenant/absence/infrastructure/state/presentation/absence.presentation.actions";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import MemberDetailsContainerComponent
	from "@tenant/member/presentation/component/details-container/member-details-container.component";
import MemberFormContainerComponent
	from "@tenant/member/presentation/component/form/member-form-container/member-form-container.component";

export type IMemberPresentationState = object;

@State<IMemberPresentationState>({
	name: 'memberPresentation',
	defaults: {},
})
@Injectable()
export class MemberPresentationState {

	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	@Action(MemberPresentationActions.CloseDetails)
	public async closeDetails() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(MemberPresentationActions.CloseForm)
	public async closeForm() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(MemberPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.UpdateOpenedDetails) {

		await this.router.navigate([{outlets: {second: ['member', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});

	}

	@Action(MemberPresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof MemberDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new MemberPresentationActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['member', payload._id]}}]);

	}

	@Action(MemberPresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IMemberPresentationState>, {payload: id}: MemberPresentationActions.OpenFormToEditById) {

		const title = this.translateService.instant('member.form.title.edit');
		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		// await this.openForm(ctx, {
		// 	payload: {
		// 		pushBoxInputs: {
		// 			title,
		// 			id,
		// 		},
		// 		componentInputs: {
		// 			item,
		// 			isEditMode: true
		// 		}
		// 	}
		// });

		const action = new MemberPresentationActions.OpenForm({
			componentInputs: {
				item,
				isEditMode: true
			},
			pushBoxInputs: {
				title,
				id,
			}
		});

		ctx.dispatch(action)

	}

	@Action(MemberPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof MemberFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.item() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new AbsencePresentationActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new AbsencePresentationActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['member', payload.componentInputs.item?._id, 'form']}}]);
		} else {
			await this.router.navigate([{outlets: {second: ['member', 'form']}}]);
		}

		// const {MemberFormContainerComponent} = await import("@tenant/member/presentation/component/form/member-form-container/member-form-container.component");
		//
		// const {componentInputs, pushBoxInputs} = payload ?? {};
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title: this.translateService.instant('member.form.title.create'),
		// 	...pushBoxInputs,
		// 	component: MemberFormContainerComponent,
		// 	componentInputs,
		// });

	}
}
