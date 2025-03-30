import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {AbsencePresentationActions} from "@tenant/absence/presentation/state/presentation/absence.presentation.actions";

export type IAbsenceState = object;

@State<IAbsenceState>({
	name: 'absencePresentation',
	defaults: {},
})
@Injectable()
export class AbsencePresentationState {


	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);

	@Action(AbsencePresentationActions.CloseDetails)
	public async closeDetailsAction() {

		const {AbsenceDetailsContainerComponent} = await import("@tenant/absence/presentation/ui/component/details/absence-details-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceDetailsContainerComponent);

	}

	@Action(AbsencePresentationActions.CloseForm)
	public async closeFormAction() {

		const {AbsenceFormContainerComponent} = await import("@tenant/absence/presentation/ui/component/form/absence-form-container.component");

		await this.whacAMaleProvider.destroyComponent(AbsenceFormContainerComponent);

	}

	@Action(AbsencePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.UpdateOpenedDetails) {

		import("@tenant/absence/presentation/ui/component/details/absence-details-container.component")
			.then(({AbsenceDetailsContainerComponent}) => {

				this.ngxLogger.debug('AbsenceState.updateOpenedDetails', 'payload', payload);

				const componentMirror = reflectComponentType(AbsenceDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('AbsenceState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						renderedComponentRef.changeDetectorRef.detectChanges();
						this.ngxLogger.debug('AbsenceState.updateOpenedDetails', 'Item updated');
						return;
					}
					this.ngxLogger.error('AbsenceState.updateOpenedDetails', 'Item not found');
				}

			});

	}

	@Action(AbsencePresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.OpenDetails) {

		const title = await this.translateService.instant('absence.details.title');

		const {AbsenceDetailsContainerComponent} = await import("@tenant/absence/presentation/ui/component/details/absence-details-container.component");

		const ref = AbsenceDetailsContainerComponent;

		const foundComponentRef = this.whacAMaleProvider.getComponentRef(ref);

		if (foundComponentRef) {


			const instance = foundComponentRef.instance.renderedComponentRef?.instance;

			if (!instance) {
				this.ngxLogger.error('AbsenceState.openDetailsAction', 'instance is not defined');
				return;
			}

			if ('item' in instance) {
				const {_id} = instance.item;
				if (_id === payload._id) {
					ctx.dispatch(new AbsencePresentationActions.CloseDetails());
					return;
				}
			}

		}

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: ref,
		});

	}

	@Action(AbsencePresentationActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsencePresentationActions.OpenFormToEditById) {

		const title = await this.translateService.instant('absence.form.title.edit');
		const item = await this.sharedUow.absence.repository.findByIdAsync(action.payload);

		if (!item) {
			this.ngxLogger.error('AbsenceState.openDetailsById', 'Item not found');
			return;
		}


		const {AbsenceFormContainerComponent} = await import("@tenant/absence/presentation/ui/component/form/absence-form-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: AbsenceFormContainerComponent,
			componentInputs: {
				item,
				isEditMode: true,
			},
		});

	}

	@Action(AbsencePresentationActions.OpenForm)
	public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsencePresentationActions.OpenForm): Promise<void> {

		const {AbsenceFormContainerComponent} = await import("@tenant/absence/presentation/ui/component/form/absence-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('absence.form.title.create'),
			...(pushBoxInputs ?? {}),
			component: AbsenceFormContainerComponent,
			componentInputs,
		});

	}

}
