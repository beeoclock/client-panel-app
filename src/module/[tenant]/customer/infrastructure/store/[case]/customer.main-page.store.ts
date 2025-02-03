import {patchState, signalStore, withMethods, withProps, withState} from "@ngrx/signals";
import {inject} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {PITableState, TableState} from "@utility/domain/table.state";
import {ICustomer} from "@customer/index";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {getMaxPage} from "@utility/domain/max-page";

export const CustomerMainPageStore = signalStore(
	withProps(() => {
		return {
			ngxLogger: inject(NGXLogger),
		}
	}),
	withState({
		tableState: new TableState<ICustomer.Entity>()
			.setFilters({})
			.setOrderBy(OrderByEnum.CREATED_AT)
			.setOrderDir(OrderDirEnum.DESC)
			.setPageSize(20)
			.toCache(),
	}),
	withDevtools('customerMainPage'),
	withMethods(({ngxLogger, ...store}) => {

		return {

			getItems: (payload: {
				resetPage: boolean;
				resetParams: boolean;
				queryParams?: Record<string, unknown>;
			} = {
				resetPage: false,
				resetParams: false,
			}) => {

				// await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

				const {tableState} = store;
				const currentTableState = tableState();

				try {

					const newTableState = TableState.fromCache(currentTableState);

					console.log({currentTableState, newTableState})

					const {
						resetPage,
						resetParams
					} = payload ?? {};

					if (resetPage) {
						newTableState.setPage(1);
					}

					if (resetParams) {
						newTableState.filters = {};
					}

					const phraseFields = ['firstName', 'lastName'];

					const params = newTableState.toBackendFormat();

					const items = ECustomer.database.find({
						...((newTableState.filters?.phrase as string)?.length ? {
							$or: phraseFields.map((field) => {
								return {
									[field]: {
										$regex: newTableState.filters.phrase,
										$options: "i"
									}
								}
							})
						} : {})
					}, {
						limit: params.pageSize,
						skip: (params.page - 1) * params.pageSize,
						sort: {
							[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
						}
					});

					console.log('items:count', items.count());

					newTableState
						.setTotal(ECustomer.database.find().count())
						.setItems(items.fetch())
						.setMaxPage(getMaxPage(newTableState.total, newTableState.pageSize));

					ngxLogger.debug('Table state: ', newTableState);

					// ctx.patchState({
					// 	tableState: newTableState.toCache(),
					// 	lastTableHashSum: newTableState.hashSum
					// });

					patchState(store, () => {
						return {
							tableState: newTableState.toCache(),
						};
					})

				} catch (e) {
					ngxLogger.error(e);
				}

				// Switch of page loader
				// await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));
			},

			updateTableState: (payload: PITableState<ICustomer.DTO>) => {

				const {tableState} = store;

				const currentTableState = tableState();

				if (Reflect.has(payload, 'orderBy') && Reflect.has(tableState, 'orderDir')) {
					if (currentTableState.orderBy === payload.orderBy) {
						payload['orderDir'] = currentTableState.orderDir === OrderDirEnum.ASC ? OrderDirEnum.DESC : OrderDirEnum.ASC;
					}
				}

				// If phrase is exist then page should be reset
				if (payload && 'phrase' in payload && payload.phrase) {
					payload['page'] = 1;
				}

				// Is tableState has phrase and payload has not then reset page
				if ('phrase' in tableState && !(payload && 'phrase' in payload)) {
					payload['page'] = 1;
				}

				const newTableState = TableState.fromCache({
					...currentTableState,
					...{
						filters: payload
					},
					items: []
				});

				patchState(store, () => {
					return {
						tableState: newTableState.toCache()
					};
				});

			}
		};
	}),
);
