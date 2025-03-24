import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {CustomerActions} from "@customer/presentation/state/customer/customer.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";

export type ICustomerState = IBaseState<ECustomer>;

const defaults = baseDefaults<ECustomer>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<ICustomerState>({
	name: 'customer',
	defaults,
})
@Injectable()
export class CustomerState {

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	private readonly sharedUow = inject(SharedUow);

	// Application layer

	@Action(CustomerActions.CloseDetails)
	public async closeDetails() {

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

		await this.whacAMaleProvider.destroyComponent(CustomerDetailsContainerComponent);

	}

	@Action(CustomerActions.CloseForm)
	public async closeForm() {

		const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");

		await this.whacAMaleProvider.destroyComponent(CustomerFormContainerComponent);

	}

	@Action(CustomerActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.UpdateOpenedDetails) {

		import("@customer/presentation/component/details/customer-details-container.component")
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

	@Action(CustomerActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.OpenDetails) {

		const title = await this.translateService.instant('customer.details.title');

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

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
					ctx.dispatch(new CustomerActions.CloseDetails());
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

	@Action(CustomerActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<ICustomerState>, {payload: id}: CustomerActions.OpenDetailsById) {

		const item = await this.sharedUow.customer.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('CustomerState.openDetailsById', 'Item not found');
			return;
		}

		ctx.dispatch(new CustomerActions.OpenDetails(item));

	}

	@Action(CustomerActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<ICustomerState>, action: CustomerActions.OpenFormToEditById) {

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

	@Action(CustomerActions.OpenForm)
	public async openForm(ctx: StateContext<ICustomerState>, {payload}: CustomerActions.OpenForm): Promise<void> {

		const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('customer.form.title.create'),
			...pushBoxInputs,
			component: CustomerFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(CustomerActions.Init)
	public async init(ctx: StateContext<ICustomerState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(CustomerActions.UpdateFilters)
	public updateFilters(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateFilters) {

		BaseState.updateFilters(ctx, action);

	}

	@Action(CustomerActions.UpdateTableState)
	public updateTableState(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateTableState) {
		BaseState.updateTableState<ECustomer>(ctx, action);
	}

	@Action(CustomerActions.GetItem)
	public async getItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
		const data = await this.sharedUow.customer.repository.findByIdAsync(action.payload);

		if (!data) {
			return;
		}

		const entity = ECustomer.fromRaw(data);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});

	}

	@Action(CustomerActions.CreateItem)
	public async createItem(ctx: StateContext<ICustomerState>, action: CustomerActions.CreateItem): Promise<void> {
		await this.sharedUow.customer.repository.createAsync(ECustomer.fromDTO(action.payload));
		await this.closeForm();
	}

	@Action(CustomerActions.UpdateItem)
	public async updateItem(ctx: StateContext<ICustomerState>, {payload: item}: CustomerActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.customer.repository.updateAsync(entity);
			await this.closeForm();
			await this.updateOpenedDetails(ctx, {payload: entity});
		}
	}

	@Action(CustomerActions.SetState)
	public async setState(ctx: StateContext<ICustomerState>, {item, state}: CustomerActions.SetState) {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.customer.repository.updateAsync(entity);
			await this.updateOpenedDetails(ctx, {payload: entity});
		}
	}

	@Action(CustomerActions.GetList)
	public async getList(ctx: StateContext<ICustomerState>, action: CustomerActions.GetList): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);

			const {
				// queryParams,
				resetPage,
				resetParams
			} = action.payload ?? {};

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const params = newTableState.toBackendFormat();

			const inState = (
				params?.state ?
					[params.state] :
					[StateEnum.active, StateEnum.archived, StateEnum.inactive]
			);


			const {items, totalSize} = await this.sharedUow.customer.repository.findAsync({
				...params,
				state: inState,
			});

			const entities = items.map(ECustomer.fromRaw);

			newTableState
				.setTotal(totalSize)
				.setItems(entities)
				.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

			this.ngxLogger.debug('Table state: ', newTableState);

			ctx.patchState({
				tableState: newTableState.toCache(),
				lastTableHashSum: newTableState.hashSum
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));


	}

}
