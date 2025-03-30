import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {MemberPresentationActions} from "@tenant/member/presentation/state/presentation/member.presentation.actions";

export type IMemberPresentationState = object;

@State<IMemberPresentationState>({
	name: 'memberPresentation',
	defaults: {},
})
@Injectable()
export class MemberPresentationState {

	private readonly sharedUow = inject(SharedUow);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(MemberPresentationActions.CloseDetails)
	public async closeDetails() {

		const {MemberDetailsContainerComponent} = await import("@tenant/member/presentation/component/details-container/member-details-container.component");

		await this.whacAMaleProvider.destroyComponent(MemberDetailsContainerComponent);

	}

	@Action(MemberPresentationActions.CloseForm)
	public async closeForm() {

		const {MemberFormContainerComponent} = await import("@tenant/member/presentation/component/form/member-form-container/member-form-container.component");

		await this.whacAMaleProvider.destroyComponent(MemberFormContainerComponent);

	}

	@Action(MemberPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.UpdateOpenedDetails) {

		import("@tenant/member/presentation/component/details-container/member-details-container.component")
			.then(async ({MemberDetailsContainerComponent}) => {

				const componentMirror = reflectComponentType(MemberDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('MemberState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						return;
					}
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'Item not found');
				}
			});


	}

	@Action(MemberPresentationActions.OpenDetails)
	public async openDetails(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.OpenDetails) {

		const title = await this.translateService.instant('member.details.title');

		const {MemberDetailsContainerComponent} = await import("@tenant/member/presentation/component/details-container/member-details-container.component");

		const ref = MemberDetailsContainerComponent;

		const foundComponentRef = this.whacAMaleProvider.getComponentRef(ref);

		if (foundComponentRef) {

			const instance = foundComponentRef.instance.renderedComponentRef?.instance;

			if (!instance) {
				this.ngxLogger.error('MemberState.openDetails', 'instance is not defined');
				return;
			}

			if ('item' in instance) {
				const {_id} = instance.item;
				if (_id === payload._id) {
					ctx.dispatch(new MemberPresentationActions.CloseDetails());
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

	@Action(MemberPresentationActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IMemberPresentationState>, {payload: id}: MemberPresentationActions.OpenDetailsById) {

		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		ctx.dispatch(new MemberPresentationActions.OpenDetails(item));

	}

	@Action(MemberPresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IMemberPresentationState>, {payload: id}: MemberPresentationActions.OpenFormToEditById) {

		const title = this.translateService.instant('member.form.title.edit');
		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					id,
				},
				componentInputs: {
					item,
					isEditMode: true
				}
			}
		});

	}

	@Action(MemberPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<IMemberPresentationState>, {payload}: MemberPresentationActions.OpenForm): Promise<void> {

		const {MemberFormContainerComponent} = await import("@tenant/member/presentation/component/form/member-form-container/member-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('member.form.title.create'),
			...pushBoxInputs,
			component: MemberFormContainerComponent,
			componentInputs,
		});

	}
}
