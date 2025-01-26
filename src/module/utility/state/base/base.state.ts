import {StateContext, Store} from "@ngxs/store";
import {BaseActions} from "@utility/state/base/base.actions";
import {AppActions} from "@utility/state/app/app.actions";
import {ITableState, TableState} from "@utility/domain/table.state";
import {firstValueFrom} from "rxjs";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {inject} from "@angular/core";
import {getMaxPage} from "@utility/domain/max-page";
import {Router} from "@angular/router";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {NGXLogger} from "ngx-logger";
import {IBaseEntity} from "@utility/domain";
import {NgEventBus} from "ng-event-bus";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";

export interface IBaseState_Item<ITEM> {
	data: undefined | ITEM;
	downloadedAt: Date;
}

export interface IBaseState<ITEM> {
	item: IBaseState_Item<ITEM>;
	tableState: ITableState<ITEM>;
	lastTableHashSum: undefined | string;
}

export function baseDefaults<T>({filters, orderBy, orderDir, pageSize}: {
	filters: { [key: string]: unknown; };
	orderBy: OrderByEnum;
	orderDir: OrderDirEnum;
	pageSize: number;
}): IBaseState<T> {
	return {
		item: {
			data: undefined,
			downloadedAt: new Date(),
		},
		tableState: new TableState<T>().setFilters(filters).setOrderBy(orderBy).setOrderDir(orderDir).setPageSize(pageSize).toCache(),
		lastTableHashSum: undefined,
	};
}

export abstract class BaseState<ITEM extends IBaseEntity<string>> {

	protected readonly ngEventBus = inject(NgEventBus);

	protected readonly router = inject(Router);
	protected readonly store = inject(Store);
	protected readonly ngxLogger = inject(NGXLogger);
	protected readonly whacAMaleProvider = inject(WhacAMoleProvider);

	protected readonly item!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly create!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly update!: BaseApiAdapter<ITEM, unknown[]>;
	protected readonly delete!: BaseApiAdapter<unknown, unknown[]>;
	protected readonly archive!: BaseApiAdapter<unknown, unknown[]>;
	protected readonly unarchive!: BaseApiAdapter<unknown, unknown[]>;
	protected readonly paged!: BaseApiAdapter<{
		items: ITEM[];
		totalSize: number;
	}, unknown[]>;

	protected constructor(
		protected defaults: IBaseState<ITEM>,
	) {
	}

	/**
	 * Init default from cache
	 * @param ctx
	 * @constructor
	 */
	public async init(
		ctx: StateContext<IBaseState<ITEM>>
	) {
		ctx.setState(structuredClone(this.defaults));
	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 * @constructor
	 */
	public updateFilters(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateFilters) {

		const state = ctx.getState();

		this.updateTableState(ctx, {
			payload: {
				...state.tableState,
				filters: payload
			}
		});

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 * @constructor
	 */
	public updateTableState(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateTableState<ITEM>) {

		const state = ctx.getState();

		if (Reflect.has(payload, 'orderBy') && Reflect.has(state.tableState, 'orderDir')) {
			if (state.tableState.orderBy === payload.orderBy) {
				payload['orderDir'] = state.tableState.orderDir === OrderDirEnum.ASC ? OrderDirEnum.DESC : OrderDirEnum.ASC;
			}
		}

		const newTableState = TableState.fromCache({
			...state.tableState,
			...payload,
			items: []
		});

		ctx.patchState({
			tableState: newTableState.toCache()
		});

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 * @constructor
	 */
	public async getItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.GetItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const data = await this.item.executeAsync(payload);

		const item = {
			data,
			downloadedAt: new Date(),
		};

		ctx.patchState({
			item
		});

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async createItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.CreateItem<ITEM>) {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			const data = await this.create.executeAsync(payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				},
			});

			await this.getList(ctx, {
				payload: {
					resetPage: false,
					resetParams: false
				}
			});

		} catch (e) {
			this.ngxLogger.error('Error Response: ', e)
		}

		ctx.dispatch(new AppActions.PageLoading(false));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async updateItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UpdateItem<ITEM>): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			const data = await this.update.executeAsync(payload);

			// Set new/updated item to store state and clear table
			ctx.patchState({
				item: {
					data,
					downloadedAt: new Date(),
				}
			});
			await this.getList(ctx, {
				payload: {
					resetPage: false,
					resetParams: false
				}
			});
		} catch (e) {
			this.ngxLogger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async deleteItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.DeleteItem): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const isOk = await this.delete.executeAsync(payload).then((result) => {
			this.ngxLogger.debug('Delete result: ', result);
			return true;
		}).catch((error) => {
			// Cancel action or there some error
			this.ngxLogger.error(error);
			return false;
		});

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

		if (isOk) {

			ctx.patchState({
				item: {
					data: undefined,
					downloadedAt: new Date(),
				}
			});

		}

		await this.getList(ctx, {
			payload: {
				resetPage: false,
				resetParams: false
			}
		});

	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async archiveItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.ArchiveItem): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			await this.archive.executeAsync(payload);

			const state = ctx.getState();

			if (state.item.data) {
				ctx.patchState({
					item: {
						data: {
							...state.item.data,
							active: ActiveEnum.NO
						} as never,
						downloadedAt: new Date(),
					}
				});
			} else {

				await this.getList(ctx, {
					payload: {
						resetPage: false,
						resetParams: false
					}
				});

			}


		} catch (e) {
			this.ngxLogger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));
	}

	/**
	 *
	 * @param ctx
	 * @param payload
	 */
	public async unarchiveItem(ctx: StateContext<IBaseState<ITEM>>, {payload}: BaseActions.UnarchiveItem): Promise<void> {

		ctx.dispatch(new AppActions.PageLoading(true));

		try {
			await this.unarchive.executeAsync(payload);

			const state = ctx.getState();

			if (state.item.data) {
				ctx.patchState({
					item: {
						data: {
							...state.item.data,
							active: ActiveEnum.YES
						} as never,
						downloadedAt: new Date(),
					}
				});
			} else {
				// Update list
				await this.getList(ctx, {
					payload: {
						resetPage: false,
						resetParams: false
					}
				});
			}


		} catch (e) {
			this.ngxLogger.error(e);
		}

		ctx.dispatch(new AppActions.PageLoading(false));
	}

	/**
	 *
	 * @param ctx
	 * @param force
	 * @param resetPage
	 */
	public async getList(ctx: StateContext<IBaseState<ITEM>>, {
		payload: {
			resetPage,
			resetParams,
			queryParams,
		}
	}: BaseActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache<ITEM>(state.tableState);

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const params = newTableState.toBackendFormat();

			// Update current state
			const {items, totalSize} = await this.paged.executeAsync({
				...params,
				...(queryParams ?? {})
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


}
