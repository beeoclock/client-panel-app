import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {CustomerDataActions} from "./customer.data.actions";
import {CustomerPresentationActions} from "@customer/presentation/state/presentation/customer.presentation.actions";

export type ICustomerState = IBaseState<ECustomer>;

const defaults = baseDefaults<ECustomer>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<ICustomerState>({
	name: 'customerData',
	defaults,
})
@Injectable()
export class CustomerDataState {

	private readonly ngxLogger = inject(NGXLogger);

	private readonly sharedUow = inject(SharedUow);


	@Action(CustomerDataActions.GetItem)
	public async getItem(ctx: StateContext<ICustomerState>, action: CustomerDataActions.GetItem): Promise<void> {
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

	@Action(CustomerDataActions.CreateItem)
	public async createItem(ctx: StateContext<ICustomerState>, action: CustomerDataActions.CreateItem): Promise<void> {
		await this.sharedUow.customer.repository.createAsync(ECustomer.fromDTO(action.payload));
		ctx.dispatch(new CustomerPresentationActions.CloseForm());
	}

	@Action(CustomerDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<ICustomerState>, {payload: item}: CustomerDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.customer.repository.updateAsync(entity);
			ctx.dispatch(new CustomerPresentationActions.CloseForm());
			ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
		}
	}

	@Action(CustomerDataActions.SetState)
	public async setState(ctx: StateContext<ICustomerState>, {item, state}: CustomerDataActions.SetState) {
		const foundItem = await this.sharedUow.customer.repository.findByIdAsync(item._id);
		if (foundItem) {
			const entity = ECustomer.fromRaw({
				...foundItem,
				...item,
			});
			entity.changeState(state);
			await this.sharedUow.customer.repository.updateAsync(entity);
			ctx.dispatch(new CustomerPresentationActions.UpdateOpenedDetails(entity));
		}
	}

	@Action(CustomerDataActions.GetList)
	public async getList(ctx: StateContext<ICustomerState>, action: CustomerDataActions.GetList): Promise<void> {
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
