import {ABaseItem} from "@src/core/abstract/a.base-item";
import {Tools} from "@utility/tools";
import {patchState, signalStore, withMethods, withProps, withState} from "@ngrx/signals";
import {ICustomer} from "@src/core/interface/i.customer";
import angularReactivityAdapter from '@signaldb/angular';
import indexedDBAdapterPersistenceSignalDB
	from "@src/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";
import {Collection} from '@signaldb/core';
import {syncManagerConfigurationRegister} from "@src/database/tenant/signaldb/sync-manager.tenant.signaldb.database";
import {customerEndpointEnum} from "@customer/endpoint/customer.endpoint";
import {CustomerTypeEnum} from "@src/module/customer/domain/enum/customer-type.enum";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@src/module/utility/domain/enum";
import {Types} from "@src/module/utility/types";
import {TranslateService} from "@ngx-translate/core";
import {inject} from "@angular/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {withDevtools} from "@angular-architects/ngrx-toolkit";
import {NGXLogger} from "ngx-logger";
import {PITableState, TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";

class CustomerCollection extends Collection<ICustomer.Entity> {
	public constructor(params: { tenantId: string, name: string }) {
		const {name} = params;
		super({
			name,
			reactivity: angularReactivityAdapter,
			persistence: indexedDBAdapterPersistenceSignalDB({
				databaseName: name,
				storeName: 'items',
				version: 1,
				storeParameters: {
					keyPath: 'id', // should be id (not _id) because syncManager uses id
					autoIncrement: false,
				}
			}),
			transform: ECustomer.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */

	public getRegular() {
		return this.find({
			customerType: CustomerTypeEnum.regular,
		})
	}

	public getNew() {
		return this.find({
			updatedAt: {
				$gte: "2025-01-28T21:00:01.095Z"
			},
		})
	}

}

const store = signalStore(
	{providedIn: 'root'},
	withProps(() => {
		return {
			translateService: inject(TranslateService),
			whacAMaleProvider: inject(WhacAMoleProvider),
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
	withDevtools('customer'),
	withMethods(({translateService, whacAMaleProvider, ngxLogger, ...store}) => {

		const openForm = async (payload?: {
			pushBoxInputs?: {
				id?: string;
				title?: string;
				showLoading?: boolean;
				callback?: {
					on?: {
						destroy?: {
							before?: () => void;
							after?: () => void;
						};
					};
				};
			};
			componentInputs?: {
				isEditMode?: boolean;
				item?: ICustomer.DTO;
			};
		}) => {

			const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");

			const {componentInputs, pushBoxInputs} = payload ?? {};

			await whacAMaleProvider.buildItAsync({
				title: translateService.instant('customer.form.title.create'),
				...pushBoxInputs,
				component: CustomerFormContainerComponent,
				componentInputs,
			});

		};

		const closeForm = async () => {

			const {CustomerFormContainerComponent} = await import("@customer/presentation/component/form/customer-form-container.component");
			return whacAMaleProvider.destroyComponent(CustomerFormContainerComponent);

		};

		const closeDetails = async () => {
			const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");
			return whacAMaleProvider.destroyComponent(CustomerDetailsContainerComponent);
		};

		return {

			// Application layer
			closeDetails,
			closeForm,
			updateOpenedDetails: async (item: ICustomer.Entity) => {

				const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");
				await whacAMaleProvider.updateWhacAMoleComponentAsync({
					component: CustomerDetailsContainerComponent,
					componentInputs: {item},
				}).catch((error) => {
					ngxLogger.error('CustomerState.updateOpenedDetails', error);
				});

			},
			openDetailsById: async (id: string) => {

				const title = await translateService.instant('customer.details.title');

				const {CustomerDetailsContainerComponent} = await import("@customer/presentation/component/details/customer-details-container.component");

				const item = ECustomer.database.findOne({
					id,
				});

				console.log('openDetails', {item})

				await whacAMaleProvider.buildItAsync({
					title,
					componentInputs: {
						item
					},
					component: CustomerDetailsContainerComponent,
				});

			},
			openFormToEditById: async (id: string) => {

				const title = await translateService.instant('customer.form.title.edit');

				await openForm({
					pushBoxInputs: {
						title,
						showLoading: true,
						id,
					},
				});

				const item = ECustomer.database.findOne({
					id,
				});

				await openForm({
					pushBoxInputs: {
						title,
						id,
					},
					componentInputs: {
						item,
						isEditMode: true,
					}
				});

			},
			openForm,

			// Data

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
						queryParams,
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
			getItem: (id: string) => ECustomer.database.findOne({
				id,
			}),
			createItem: async (payload: ICustomer.DTO) => {
				ECustomer.database.insert(
					ECustomer.create(payload)
				);
				await closeForm();
			},
			updateItem: async (payload: ICustomer.DTO) => {
				const item = ECustomer.create(payload);
				ECustomer.database.updateOne({
					id: payload._id,
				}, {
					$set: item
				});
				await closeForm();
			},
			deleteItem: (id: string) => {
				ECustomer.database.removeOne({
					id,
				});
				return closeDetails();
			},
			archiveItem: async (id: string) => {
				ECustomer.database.updateOne({
					id,
				}, {
					$set: {
						active: ActiveEnum.NO,
					}
				});
			},
			unarchiveItem: async (id: string) => {
				ECustomer.database.updateOne({
					id,
				}, {
					$set: {
						active: ActiveEnum.YES,
					}
				});
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

export class ECustomer extends ABaseItem<'CustomerDto', ICustomer.DTO> implements ICustomer.Entity {

	firstName!: (string & Types.MaxLength<50>) | null;
	lastName!: (string & Types.MaxLength<50>) | null;
	phone!: string | null;
	email!: (string & Types.Email) | null;
	note!: string | null;
	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
	active!: ActiveEnum;

	// Implement to find customer with the same lastName
	public getNamesake() {
		const {lastName, id} = this;
		// Not me but with the same lastName
		console.log('namesakes', {lastName})
		return ECustomer.database.find({
			lastName,
			_id: {
				$ne: id,
			},
		})
	}

	public override toDTO(): ICustomer.DTO {
		return ECustomer.toDTO(this);
	}

	public static collectionName = `customer`;

	public static toDTO(data: ICustomer.Entity): ICustomer.DTO {
		const {id, ...rest} = data;
		return rest;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: ICustomer.DTO): ICustomer.Entity {
		return new ECustomer(data);
	}

	/**
	 * Database in indexedDB
	 */

	static #database: {
		tenantId: string;
		collection: CustomerCollection;
	};

	/**
	 *
	 * @param tenantId
	 * @param force
	 */
	public static initDatabase(tenantId: string, force = false) {
		force ||= !this.databasePreparedFor(tenantId);

		if (!force) {

			return 'exists';

		}

		// Don't declare like `${tenantId}-${this.collectionName}` because it will be changed in every tenant
		this.collectionName = `${tenantId}-customer`;

		const collection = new CustomerCollection({
			tenantId,
			name: this.collectionName,
		});

		this.#database = {
			tenantId,
			collection,
		};

		return 'created';
	}

	/**
	 *
	 * @param tenantId
	 */
	public static databasePreparedFor(tenantId: string) {
		return !!this.#database && this.#database.tenantId === tenantId;
	}

	public static get database() {
		return this.#database.collection;
	}

	public static getSyncConfiguration() {

		if (!this.#database) {
			throw new Error('Database is not initialized');
		}

		const {collection} = this.#database;

		return {
			collection,
			options: {
				name: this.collectionName,
				toDTO: this.toDTO,
				create: this.create,
				endpoint: {
					get: customerEndpointEnum.paged,
					post: customerEndpointEnum.create,
					put: customerEndpointEnum.update,
					delete: customerEndpointEnum.delete,
				}
			}
		};

	}

	/**
	 * RAM store
	 */

	public static readonly store = store;

	/**
	 * Tools
	 */

	public static readonly is = {
		dto: Tools.createIs<ICustomer.DTO>(),
		entity: Tools.createIs<ICustomer.Entity>(),
	};
	public static readonly isValid = {
		dto: Tools.createValidate<ICustomer.DTO>(),
		entity: Tools.createValidate<ICustomer.Entity>(),
	};
	public static readonly getRandom = {
		dto: Tools.createRandom<ICustomer.DTO>(),
		entity: Tools.createRandom<ICustomer.Entity>(),
	};

}

syncManagerConfigurationRegister.push(ECustomer.getSyncConfiguration.bind(ECustomer) as never);

export default ECustomer;
