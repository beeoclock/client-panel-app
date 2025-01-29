import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import * as Customer from "@customer/domain";
import {ICustomer} from "@customer/domain";
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
import ECustomer from "@core/entity/e.customer";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
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
		// await super.createItem(ctx, action);
		ECustomer.database.insert(ECustomer.create({
			...action.payload,
			id: action.payload._id,
		}));
		await this.closeForm(ctx);
	}

	@Action(CustomerActions.UpdateItem)
	public override async updateItem(ctx: StateContext<ICustomerState>, action: CustomerActions.UpdateItem): Promise<void> {
		// await super.updateItem(ctx, action);
		ECustomer.database.updateOne({
			id: action.payload._id,
		}, {
			$set: ECustomer.create({
				...action.payload,
				id: action.payload._id,
			})
		});
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
		// await super.getList(ctx, action);
		// const syncedAt = new Date().toISOString();
		// const {tableState} = ctx.getState();
		// tableState.items.forEach((item) => {
		// 	const entity = LocalEntity.create(item, syncedAt);
		// 	this.customerTenantDatabaseService.put(entity);
		// });


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

			// const params = newTableState.toBackendFormat();

			// Update current state
			// const {items, totalSize} = await this.paged.executeAsync({
			// 	...params,
			// 	...(queryParams ?? {})
			// });

			const items = ECustomer.database.find({

			},{
				limit: newTableState.pageSize,
				skip: (newTableState.page - 1) * newTableState.pageSize,
				sort: {
					[newTableState.orderBy]: newTableState.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			});

			console.log('items:count', items.count());

			newTableState
				.setTotal(ECustomer.database.find().count())
				.setItems(items.fetch() as unknown as ICustomer[])
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
