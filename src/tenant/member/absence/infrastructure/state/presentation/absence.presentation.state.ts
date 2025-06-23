import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {Router} from "@angular/router";
import AbsenceDetailsContainerComponent
	from "@tenant/member/absence/presentation/ui/component/details/absence-details-container.component";
import {FormAbsencePage} from "@tenant/member/absence/presentation/ui/page/form/form.absence.page";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";

export type IAbsenceState = object;

@State<IAbsenceState>({
	name: 'absencePresentation',
	defaults: {},
})
@Injectable()
export class AbsencePresentationState {


	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);

	private readonly secondRouterOutletService = inject(SecondRouterOutletService);
	private readonly router = inject(Router);

	@Action(AbsencePresentationActions.CloseDetails)
	public async closeDetailsAction() {

		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(AbsencePresentationActions.CloseForm)
	public async closeFormAction() {
		await this.router.navigate([{outlets: {second: null}}]);

	}

	@Action(AbsencePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.UpdateOpenedDetails) {

		await this.router.navigate([{outlets: {second: ['absence', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});

	}

	@Action(AbsencePresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof AbsenceDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new AbsencePresentationActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['absence', payload._id]}}]);

	}

	@Action(AbsencePresentationActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');
		const item = await this.sharedUow.absence.repository.findByIdAsync(payload);

		if (!item) {
			this.ngxLogger.error('AbsenceState.openDetailsById', 'Item not found');
			return;
		}

		const action = new AbsencePresentationActions.OpenForm({
			componentInputs: {
				item: EAbsence.fromRaw(item),
				isEditMode: true,
			},
			pushBoxInputs: {
				title,
			}
		});
		ctx.dispatch(action);

		// const {AbsenceFormContainerComponent} = await import("@tenant/absence/presentation/ui/component/form/absence-form-container.component");
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title,
		// 	component: AbsenceFormContainerComponent,
		// 	componentInputs: {
		// 		item,
		// 		isEditMode: true,
		// 	},
		// });

	}

	@Action(AbsencePresentationActions.OpenForm)
	public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof FormAbsencePage) {
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

		const {defaultValue} = payload?.componentInputs ?? {defaultValue: {}};

		const queryParams = {
			defaultValue: JSON.stringify(defaultValue),
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['absence', payload.componentInputs.item?._id, 'form']}}], {queryParams});
		} else {
			await this.router.navigate([{outlets: {second: ['absence', 'form']}}], {queryParams});
		}

		// const {AbsenceFormContainerComponent} = await import("@tenant/absence/presentation/ui/component/form/absence-form-container.component");
		//
		// const {componentInputs, pushBoxInputs} = payload ?? {};
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title: this.translateService.instant('absence.form.title.create'),
		// 	...(pushBoxInputs ?? {}),
		// 	component: AbsenceFormContainerComponent,
		// 	componentInputs,
		// });

	}

}
