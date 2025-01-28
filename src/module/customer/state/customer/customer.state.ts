import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ArchiveCustomerApiAdapter} from "@customer/adapter/external/api/archive.customer.api.adapter";
import {CreateCustomerApiAdapter} from "@customer/adapter/external/api/create.customer.api.adapter";
import {UpdateCustomerApiAdapter} from "@customer/adapter/external/api/update.customer.api.adapter";
import {ItemCustomerApiAdapter} from "@customer/adapter/external/api/item.customer.api.adapter";
import {RemoveCustomerApiAdapter} from "@customer/adapter/external/api/remove.customer.api.adapter";
import {ListCustomerApiAdapter} from "@customer/adapter/external/api/list.customer.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {UnarchiveCustomerApiAdapter} from "@customer/adapter/external/api/unarchive.customer.api.adapter";
import {TranslateService} from "@ngx-translate/core";
// import {SyncCustomerTenantDatabaseService} from "@customer/database/tenant/sync.customer.tenant.database.service";

export type ICustomerState = IBaseState<Customer.ICustomer>;

const defaults = baseDefaults<Customer.ICustomer>({
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
export class CustomerState extends BaseState<Customer.ICustomer> {

	protected override readonly archive = inject(ArchiveCustomerApiAdapter);
	protected override readonly unarchive = inject(UnarchiveCustomerApiAdapter);
	protected override readonly create = inject(CreateCustomerApiAdapter);
	protected override readonly update = inject(UpdateCustomerApiAdapter);
	protected override readonly item = inject(ItemCustomerApiAdapter);
	protected override readonly delete = inject(RemoveCustomerApiAdapter);
	protected override readonly paged = inject(ListCustomerApiAdapter);

	private readonly translateService = inject(TranslateService);

	// private readonly customerTenantDatabaseService = inject(CustomerTenantDatabaseService);
	// private readonly syncCustomerTenantDatabaseService = inject(SyncCustomerTenantDatabaseService);


	constructor() {
		super(
			defaults,
		);
	}

	// DataBase layer

	@Action(CustomerActions.Sync)
	public async sync(ctx: StateContext<ICustomerState>) {

		// await this.syncCustomerTenantDatabaseService.execute();

		// const list = await this.customerTenantDatabaseService.getAll();
		//
		// for (const item of list) {
		//
		// 	try {
		//
		// 		let action: CustomerActions.DeleteItem | CustomerActions.CreateItem | CustomerActions.UpdateItem | null = null;
		//
		// 		// Is Created?
		// 		if (!item.syncedAt) {
		// 			// action = new CustomerActions.CreateItem(item);
		// 		}
		//
		// 		// Is Deleted?
		// 		if (item.deletedAt && item.deletedAt > item.data.updatedAt)  {
		// 			action = new CustomerActions.DeleteItem(item._id);
		// 		}
		//
		// 		// Is Updated?
		// 		if (item.syncedAt && item.data.updatedAt > item.syncedAt) {
		// 			// action = new CustomerActions.UpdateItem(item);
		// 		}
		//
		// 		if (action) {
		//
		// 			await ctx.dispatch(action);  // Видалення на сервері
		//
		// 		}
		//
		// 	} catch (error) {
		//
		// 		console.error('Sync failed for:', {item}, error);
		//
		// 	}
		//
		// }

	}

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
	public override async init(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(CustomerActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(CustomerActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(CustomerActions.GetItem)
	public override async getItem(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(CustomerActions.CreateItem)
	public override async createItem(ctx: StateContext<ICustomerState>, action: CustomerActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
		await this.closeForm(ctx);
	}

	@Action(CustomerActions.UpdateItem)
	public override async updateItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeForm(ctx);
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetails(ctx, {payload: data});
	}

	@Action(CustomerActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetails(ctx, action);
	}

	@Action(CustomerActions.ArchiveItem)
	public override async archiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.ArchiveItem) {
		await super.archiveItem(ctx, action);
	}

	@Action(CustomerActions.UnarchiveItem)
	public override async unarchiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UnarchiveItem) {
		await super.unarchiveItem(ctx, action);
	}

	@Action(CustomerActions.GetList)
	public override async getList(ctx: StateContext<ICustomerState>, action: CustomerActions.GetList): Promise<void> {
		await super.getList(ctx, action);
		// const syncedAt = new Date().toISOString();
		// const {tableState} = ctx.getState();
		// tableState.items.forEach((item) => {
		// 	const entity = LocalEntity.create(item, syncedAt);
		// 	this.customerTenantDatabaseService.put(entity);
		// });
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
