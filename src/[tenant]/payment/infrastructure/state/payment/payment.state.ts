import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {PaymentActions} from "@[tenant]/payment/infrastructure/state/payment/payment.actions";
import EPayment from "@core/business-logic/payment/entity/e.payment";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {StateEnum} from "@core/shared/enum/state.enum";
import {getMaxPage} from "@utility/domain/max-page";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";

export type IPaymentState = IBaseState<IPayment.DTO>;

const defaults = baseDefaults<IPayment.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IPaymentState>({
	name: 'payment',
	defaults,
})
@Injectable()
export class PaymentState {

	private readonly sharedUow = inject(SharedUow);

	private readonly ngxLogger = inject(NGXLogger);

	// API

	@Action(PaymentActions.Init)
	public async init(ctx: StateContext<IPaymentState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(PaymentActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(PaymentActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateTableState) {
		BaseState.updateTableState(ctx, action);
	}

	@Action(PaymentActions.CreateItem)
	public async createItem(ctx: StateContext<IPaymentState>, action: PaymentActions.CreateItem) {
		await this.sharedUow.payment.repository.createAsync(EPayment.fromDTO(action.payload));
		ctx.dispatch(new PaymentActions.GetList());
	}

	@Action(PaymentActions.Update)
	public async update(ctx: StateContext<IPaymentState>, {payload: {item}}: PaymentActions.Update): Promise<void> {
		const foundItems = await this.sharedUow.payment.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EPayment.fromRaw({
				...foundItems,
				...item,
			});
			await this.sharedUow.payment.repository.updateAsync(entity);
		}
	}

	@Action(PaymentActions.GetItem)
	public async getItem(ctx: StateContext<IPaymentState>, {payload: id}: PaymentActions.GetItem): Promise<void> {

		const data = await this.sharedUow.payment.repository.findByIdAsync(id);

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

	@Action(PaymentActions.GetList)
	public async getList(ctx: StateContext<IPaymentState>, action: PaymentActions.GetList): Promise<void> {

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

			const {items, totalSize} = await this.sharedUow.payment.repository.findAsync({
				...params,
				state: inState,
			});

			newTableState
				.setTotal(totalSize)
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
	public static itemData(state: IPaymentState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IPaymentState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IPaymentState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IPaymentState) {
		return state.tableState.filters;
	}

}
