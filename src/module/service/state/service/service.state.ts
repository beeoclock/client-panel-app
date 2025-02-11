import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";

import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {ServiceActions} from "@service/state/service/service.actions";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {ServiceIndexedDBFacade} from "@service/infrastructure/facade/indexedDB/service.indexedDB.facade";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EService from "@service/domain/entity/e.service";
import {StateEnum} from "@utility/domain/enum/state.enum";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {IService} from "@service/domain/interface/i.service";

export type IServiceState = IBaseState<IService.DTO>

const defaults = baseDefaults<IService.DTO>({
	filters: {},
	orderDir: OrderDirEnum.DESC,
	orderBy: OrderByEnum.CREATED_AT,
	pageSize: 20
});

@State<IServiceState>({
	name: 'service',
	defaults
})
@Injectable()
export class ServiceState {

	public readonly serviceIndexedDBFacade = inject(ServiceIndexedDBFacade);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	// Application layer

	@Action(ServiceActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IServiceState>, action?: ServiceActions.CloseDetails) {
		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");
		await this.whacAMaleProvider.destroyComponent(ServiceDetails);
	}

	@Action(ServiceActions.CloseForm)
	public async closeForm(ctx: StateContext<IServiceState>, action?: ServiceActions.CloseForm) {
		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");
		await this.whacAMaleProvider.destroyComponent(ServiceContainerFormComponent);
	}

	@Action(ServiceActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IServiceState>, {payload}: ServiceActions.UpdateOpenedDetails) {

		import("@service/presentation/component/service-details/service-details")
			.then(({ServiceDetails}) => {

				const componentMirror = reflectComponentType(ServiceDetails);

				if (!componentMirror) {
					this.ngxLogger.error('ServiceState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('ServiceState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('ServiceState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						return;
					}
					this.ngxLogger.error('ServiceState.updateOpenedDetails', 'Item not found', {
						payload,
						_id,
						renderedComponentRef
					});
				}
			});

	}

	@Action(ServiceActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenDetails) {

		const title = this.translateService.instant('service.details.title');

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: ServiceDetails,
		});

	}

	@Action(ServiceActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IServiceState>, {payload: id}: ServiceActions.OpenDetailsById) {

		const title = this.translateService.instant('service.details.title');
		const item = this.serviceIndexedDBFacade.source.findOne({
			id
		});

		if (!item) {
			this.ngxLogger.error('ServiceState.openDetailsById', 'Item not found');
			return;
		}

		const {ServiceDetails} = await import("@service/presentation/component/service-details/service-details");

		await this.whacAMaleProvider.buildItAsync({
			title,
			showLoading: true,
			component: ServiceDetails,
			componentInputs: {item},
		});

	}

	@Action(ServiceActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IServiceState>, {payload: id}: ServiceActions.OpenFormToEditById) {

		const title = this.translateService.instant('service.form.title.edit');
		const item = this.serviceIndexedDBFacade.source.findOne({
			id
		});

		if (!item) {
			this.ngxLogger.error('ServiceState.openFormToEditById', 'Item not found');
			return;
		}

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					id,
					title,
				},
				componentInputs: {
					item,
					isEditMode: true,
				}
			}
		});

	}

	@Action(ServiceActions.OpenForm)
	public async openForm(ctx: StateContext<IServiceState>, {payload}: ServiceActions.OpenForm): Promise<void> {

		const {ServiceContainerFormComponent} = await import("@service/presentation/component/form/service-container–form/service-container–form.component");

		const {pushBoxInputs, componentInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('service.form.title.create'),
			...pushBoxInputs,
			component: ServiceContainerFormComponent,
			componentInputs,
		});

	}

	// API

	@Action(ServiceActions.Init)
	public async init(ctx: StateContext<IServiceState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(ServiceActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateFilters) {

		BaseState.updateFilters(ctx, action);
	}

	@Action(ServiceActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateTableState) {
		BaseState.updateTableState(ctx, action);
	}

	@Action(ServiceActions.CreateItem)
	public async createItem(ctx: StateContext<IServiceState>, action: ServiceActions.CreateItem) {
		this.serviceIndexedDBFacade.source.insert(EService.create(action.payload));
		await this.closeForm(ctx);
		ctx.dispatch(new ServiceActions.GetList());
	}

	@Action(ServiceActions.UpdateItem)
	public async updateItem(ctx: StateContext<IServiceState>, action: ServiceActions.UpdateItem): Promise<void> {
		const item = EService.create({
			...action.payload
		});
		this.serviceIndexedDBFacade.source.updateOne({
			id: action.payload._id,
		}, {
			$set: item
		});
		await this.closeForm(ctx);
		await this.updateOpenedDetails(ctx, {payload: item});
		ctx.dispatch(new ServiceActions.GetList());
	}

	@Action(ServiceActions.GetItem)
	public async getItem(ctx: StateContext<IServiceState>, action: ServiceActions.GetItem): Promise<void> {
		const data = this.serviceIndexedDBFacade.source.findOne({
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

	@Action(ServiceActions.DeleteItem)
	public async deleteItem(ctx: StateContext<IServiceState>, action: ServiceActions.DeleteItem) {
		this.serviceIndexedDBFacade.source.removeOne({
			id: action.payload
		});
		await this.closeDetails(ctx, action);
		ctx.dispatch(new ServiceActions.GetList());
	}

	@Action(ServiceActions.GetList)
	public async getList(ctx: StateContext<IServiceState>, action: ServiceActions.GetList): Promise<void> {
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);


			const {
				resetPage,
				resetParams
			} = action.payload ?? {};

			if (resetPage) {
				newTableState.setPage(1);
			}

			if (resetParams) {
				newTableState.filters = {};
			}

			const phraseFields = [
				'languageVersions.title',
				'languageVersions.description',
			];

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

			const items = this.serviceIndexedDBFacade.source.find(selector, {
				limit: params.pageSize,
				skip: (params.page - 1) * params.pageSize,
				sort: {
					[params.orderBy]: params.orderDir === OrderDirEnum.ASC ? 1 : -1
				}
			}).fetch();

			const count = this.serviceIndexedDBFacade.source.find(selector).count();

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

	@Action(ServiceActions.SetState)
	public async setState(ctx: StateContext<IServiceState>, {id, state}: ServiceActions.SetState) {
		const item = this.serviceIndexedDBFacade.source.findOne({
			id
		});
		if (!item) {
			this.ngxLogger.error('ServiceState.setState', 'Item not found');
			return;
		}
		this.serviceIndexedDBFacade.source.updateOne({
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
		ctx.dispatch(new ServiceActions.GetList());
	}

	// Selectors

	@Selector()
	public static itemData(state: IServiceState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IServiceState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IServiceState) {
		return state.tableState;
	}

}
