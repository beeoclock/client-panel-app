import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@core/business-logic/customer";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {CustomerIndexedDBFacade} from "@customer/infrastructure/facade/indexedDB/customer.indexedDB.facade";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {StateEnum} from "@utility/domain/enum/state.enum";

export type ICustomerState = IBaseState<Customer.ICustomer.Entity>;

const defaults = baseDefaults<Customer.ICustomer.Entity>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: 20
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

	public readonly customerIndexedDBFacade = inject(CustomerIndexedDBFacade);

	// Application layer

	@Action(CustomerActions.CloseDetails)
	public async closeDetails(ctx: StateContext<ICustomerState>, action?: CustomerActions.CloseDetails) {

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

		await this.whacAMaleProvider.destroyComponent(CustomerDetailsContainerComponent);

	}

	@Action(CustomerActions.CloseForm)
	public async closeForm(ctx: StateContext<ICustomerState>) {

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

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: CustomerDetailsContainerComponent,
		});

	}

	@Action(CustomerActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<ICustomerState>, {payload: id}: CustomerActions.OpenDetailsById) {

		const title = await this.translateService.instant('customer.details.title');
		const item = this.customerIndexedDBFacade.source.findOne({
			id
		});

		if (!item) {
			this.ngxLogger.error('CustomerState.openDetailsById', 'Item not found');
			return;
		}

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: CustomerDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(CustomerActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<ICustomerState>, action: CustomerActions.OpenFormToEditById) {

		const title = await this.translateService.instant('customer.form.title.edit');
		const item = this.customerIndexedDBFacade.source.findOne({
			id: action.payload
		});

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
		BaseState.updateTableState(ctx, action);
	}

	@Action(CustomerActions.GetItem)
	public async getItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
		const data = this.customerIndexedDBFacade.source.findOne({
			id: action.payload
		});

		if (!data) {
			return;
		}

		ctx.patchState({
			item: {
				data,
				downloadedAt: new Date(),
			}
		});

	}

	@Action(CustomerActions.CreateItem)
	public async createItem(ctx: StateContext<ICustomerState>, action: CustomerActions.CreateItem): Promise<void> {
		this.customerIndexedDBFacade.source.insert(ECustomer.create(action.payload));
		ctx.dispatch(new CustomerActions.GetList());
		await this.closeForm(ctx);
	}

	@Action(CustomerActions.UpdateItem)
	public async updateItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateItem): Promise<void> {
		const item = ECustomer.create({
			...action.payload
		});
		this.customerIndexedDBFacade.source.updateOne({
			id: action.payload._id,
		}, {
			$set: item
		});
		ctx.dispatch(new CustomerActions.GetList());
		await this.closeForm(ctx);
		const {data} = ctx.getState().item;
		if (data) await this.updateOpenedDetails(ctx, {payload: item});
	}

	@Action(CustomerActions.DeleteItem)
	public async deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem) {
		this.customerIndexedDBFacade.source.removeOne({
			id: action.payload
		});
		ctx.dispatch(new CustomerActions.GetList());
		await this.closeDetails(ctx, action);
		ctx.dispatch(new CustomerActions.GetList());
	}

	@Action(CustomerActions.SetState)
	public async setState(ctx: StateContext<ICustomerState>, {id, state}: CustomerActions.SetState) {
		const item = this.customerIndexedDBFacade.source.findOne({
			id
		});
		if (!item) {
			this.ngxLogger.error('CustomerState.setState', 'Item not found');
			return;
		}
		this.customerIndexedDBFacade.source.updateOne({
				id
			},
			{
				$set: {
					state,
					stateHistory: [
						...item.stateHistory,
						{
							state,
							setAt: new Date().toISOString()
						}
					]
				}
			});
		const {data} = ctx.getState().item;
		if (data) await this.updateOpenedDetails(ctx, {payload: item});
		ctx.dispatch(new CustomerActions.GetList());
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

			const phraseFields = ['firstName', 'lastName', 'email', 'phone', 'note']

			const params = newTableState.toBackendFormat();

			const inState = (
				params?.state ?
					[params.state] :
					[StateEnum.active, StateEnum.archived, StateEnum.inactive]
			);

			const selector = {
				$and: [
					...((params?.phrase as string)?.length ? [{
						$or: phraseFields.map((field) => {
							return {
								[field]: {
									$regex: params.phrase,
									$options: "i"
								}
							}
						})
					}] : []),
					{
						state: {
							$in: inState
						}
					}
				]
			};

			const items = this.customerIndexedDBFacade.source.find(selector, {
				limit: params.pageSize,
				skip: (params.page - 1) * params.pageSize,
				sort: {
					[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			}).fetch();

			const count = this.customerIndexedDBFacade.source.find(selector).count();

			newTableState
				.setTotal(count)
				.setItems(items)
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

	// Selectors

	@Selector()
	public static itemData(state: ICustomerState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: ICustomerState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: ICustomerState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: ICustomerState) {
		return state.tableState.filters;
	}

}
