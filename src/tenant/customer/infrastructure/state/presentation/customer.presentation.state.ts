import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@shared/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

export type ICustomerPresentationState = object;

@State<ICustomerPresentationState>({
	name: 'customerPresentation',
	defaults: {},
})
@Injectable()
export class CustomerPresentationState {

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	private readonly sharedUow = inject(SharedUow);


	@Action(CustomerPresentationActions.CloseDetails)
	public async closeDetails() {

		const {CustomerDetailsContainerComponent} = await import("@tenant/customer/presentation/ui/component/details/customer-details-container.component");

		await this.whacAMaleProvider.destroyComponent(CustomerDetailsContainerComponent);

	}

	@Action(CustomerPresentationActions.CloseForm)
	public async closeForm() {

		const {CustomerFormContainerComponent} = await import("@tenant/customer/presentation/ui/component/form/customer-form-container.component");

		await this.whacAMaleProvider.destroyComponent(CustomerFormContainerComponent);

	}

	@Action(CustomerPresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.UpdateOpenedDetails) {

		import("@tenant/customer/presentation/ui/component/details/customer-details-container.component")
			.then(async ({CustomerDetailsContainerComponent}) => {

				const componentMirror = reflectComponentType(CustomerDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('CustomerState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('CustomerState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('CustomerState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						return;
					}
					this.ngxLogger.error('CustomerState.updateOpenedDetails', 'Item not found');
				}
			})

	}

	@Action(CustomerPresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.OpenDetails) {

		const title = await this.translateService.instant('customer.details.title');

		const {CustomerDetailsContainerComponent} = await import("@tenant/customer/presentation/ui/component/details/customer-details-container.component");

		const ref = CustomerDetailsContainerComponent;

		const foundComponentRef = this.whacAMaleProvider.getComponentRef(ref);

		if (foundComponentRef) {

			const instance = foundComponentRef.instance.renderedComponentRef?.instance;


			if (!instance) {
				this.ngxLogger.error('CustomerState.openDetailsAction', 'instance is not defined');
				return;
			}

			if ('item' in instance) {
				const {_id} = instance.item();
				if (_id === payload._id) {
					ctx.dispatch(new CustomerPresentationActions.CloseDetails());
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

	@Action(CustomerPresentationActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<ICustomerPresentationState>, {payload: id}: CustomerPresentationActions.OpenDetailsById) {

		const item = await this.sharedUow.customer.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('CustomerState.openDetailsById', 'Item not found');
			return;
		}

		ctx.dispatch(new CustomerPresentationActions.OpenDetails(item));

	}

	@Action(CustomerPresentationActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<ICustomerPresentationState>, action: CustomerPresentationActions.OpenFormToEditById) {

		const title = await this.translateService.instant('customer.form.title.edit');
		const item = await this.sharedUow.customer.repository.findByIdAsync(action.payload);

		if (!item) {
			this.ngxLogger.error('CustomerState.openFormToEditById', 'Item not found');
			return;
		}

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					id: action.payload,
				},
				componentInputs: {
					item,
					isEditMode: true,
				}
			}
		});

	}

	@Action(CustomerPresentationActions.OpenForm)
	public async openForm(ctx: StateContext<ICustomerPresentationState>, {payload}: CustomerPresentationActions.OpenForm): Promise<void> {

		const {CustomerFormContainerComponent} = await import("@tenant/customer/presentation/ui/component/form/customer-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('customer.form.title.create'),
			...pushBoxInputs,
			component: CustomerFormContainerComponent,
			componentInputs,
		});

	}

}
