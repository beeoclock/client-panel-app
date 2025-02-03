import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ArchiveCustomerApiAdapter} from "@customer/infrastructure/api/archive.customer.api.adapter";
import {CreateCustomerApiAdapter} from "@customer/infrastructure/api/create.customer.api.adapter";
import {UpdateCustomerApiAdapter} from "@customer/infrastructure/api/update.customer.api.adapter";
import {ItemCustomerApiAdapter} from "@customer/infrastructure/api/item.customer.api.adapter";
import {RemoveCustomerApiAdapter} from "@customer/infrastructure/api/remove.customer.api.adapter";
import {ListCustomerApiAdapter} from "@customer/infrastructure/api/list.customer.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {UnarchiveCustomerApiAdapter} from "@customer/infrastructure/api/unarchive.customer.api.adapter";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";

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

	private readonly archive = inject(ArchiveCustomerApiAdapter);
	private readonly unarchive = inject(UnarchiveCustomerApiAdapter);
	private readonly create = inject(CreateCustomerApiAdapter);
	private readonly update = inject(UpdateCustomerApiAdapter);
	private readonly item = inject(ItemCustomerApiAdapter);
	private readonly delete = inject(RemoveCustomerApiAdapter);
	private readonly paged = inject(ListCustomerApiAdapter);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

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

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: CustomerDetailsContainerComponent,
			componentInputs: {item: payload},
		}).catch((error) => {
			this.ngxLogger.error('CustomerState.updateOpenedDetails', error);
		});

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

		const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
			component: CustomerDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: CustomerDetailsContainerComponent,
			componentInputs: {item},
		});

	}

	@Action(CustomerActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<ICustomerState>, action: CustomerActions.OpenFormToEditById) {

		const title = await this.translateService.instant('customer.form.title.edit');

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					showLoading: true,
					id: action.payload,
				},
			}
		});

		const item = await this.item.executeAsync(action.payload);

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
		// super.updateFilters(ctx, action);
	}

	@Action(CustomerActions.UpdateTableState)
	public updateTableState(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateTableState) {
		// super.updateTableState(ctx, action);
	}

	@Action(CustomerActions.GetItem)
	public async getItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
		// await super.getItem(ctx, action);
	}

	@Action(CustomerActions.CreateItem)
	public async createItem(ctx: StateContext<ICustomerState>, action: CustomerActions.CreateItem): Promise<void> {
		// await super.createItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(CustomerActions.UpdateItem)
	public async updateItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateItem): Promise<void> {
		// await super.updateItem(ctx, action);
		await this.closeForm(ctx);
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetails(ctx, {payload: data});
	}

	@Action(CustomerActions.DeleteItem)
	public async deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem) {
		// await super.deleteItem(ctx, action);
		await this.closeDetails(ctx, action);
	}

	@Action(CustomerActions.ArchiveItem)
	public async archiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.ArchiveItem) {
		// await super.archiveItem(ctx, action);
	}

	@Action(CustomerActions.UnarchiveItem)
	public async unarchiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UnarchiveItem) {
		// await super.unarchiveItem(ctx, action);
		// TODO: Update opened details

	}

	@Action(CustomerActions.GetList)
	public async getList(ctx: StateContext<ICustomerState>, action: CustomerActions.GetList): Promise<void> {
		// await super.getList(ctx, action);

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
