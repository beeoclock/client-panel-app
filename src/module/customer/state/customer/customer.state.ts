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

export type ICustomerState = IBaseState<Customer.ICustomer>;

@State<ICustomerState>({
	name: 'customer',
	defaults: baseDefaults<Customer.ICustomer>()
})
@Injectable()
export class CustomerState extends BaseState<Customer.ICustomer> {

	protected override readonly archive = inject(ArchiveCustomerApiAdapter);
	protected override readonly create = inject(CreateCustomerApiAdapter);
	protected override readonly update = inject(UpdateCustomerApiAdapter);
	protected override readonly item = inject(ItemCustomerApiAdapter);
	protected override readonly remove = inject(RemoveCustomerApiAdapter);
	protected override readonly list = inject(ListCustomerApiAdapter);

	constructor() {
		super(
			CustomerActions,
			{
				tableStates: 'customer.cache.tableStates',
				items: 'customer.cache.items'
			}
		);
	}

	@Action(CustomerActions.Init)
	public override async init(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(CustomerActions.InitDefaultsFromCache)
	public override async InitDefaultsFromCache(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.InitDefaultsFromCache(ctx);
	}

	@Action(CustomerActions.ClearTableCache)
	public override async ClearTableCache(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.ClearTableCache(ctx);
	}

	@Action(CustomerActions.ClearItemCache)
	public override async ClearItemCache(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.ClearItemCache(ctx);
	}

	@Action(CustomerActions.ClearTableCacheAndGetList)
	public override async ClearTableCacheAndGetList(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.ClearTableCacheAndGetList(ctx);
	}

	@Action(CustomerActions.ClearItemCacheAndGetItem)
	public override async ClearItemCacheAndGetItem(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.ClearItemCacheAndGetItem(ctx);
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
	public override async getItemFromCacheOrApi(ctx: StateContext<ICustomerState>, action: CustomerActions.GetItem): Promise<void> {
		await super.getItemFromCacheOrApi(ctx, action);
	}

	@Action(CustomerActions.CreateItem)
	public override async createItem(ctx: StateContext<ICustomerState>, action: CustomerActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
	}

	@Action(CustomerActions.UpdateItem)
	public override async updateItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
	}

	@Action(CustomerActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<ICustomerState>, action: CustomerActions.DeleteItem) {
		await super.deleteItem(ctx, action);
	}

	@Action(CustomerActions.ArchiveItem)
	public override async archiveItem(ctx: StateContext<ICustomerState>, action: CustomerActions.ArchiveItem) {
		await super.archiveItem(ctx, action);
	}

	@Action(CustomerActions.GetList)
	public override async getList(ctx: StateContext<ICustomerState>): Promise<void> {
		await super.getList(ctx);

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
