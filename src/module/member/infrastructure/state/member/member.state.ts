import {inject, Injectable, reflectComponentType} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {MemberProfileStatusEnum} from "@src/core/business-logic/member/enums/member-profile-status.enum";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EMember from "@src/core/business-logic/member/entity/e.member";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {getMaxPage} from "@utility/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";

export type IMemberState = IBaseState<EMember>;

const defaults = baseDefaults<EMember>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IMemberState>({
	name: 'member',
	defaults,
})
@Injectable()
export class MemberState {

	private readonly sharedUow = inject(SharedUow);

	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);

	// Application layer

	@Action(MemberActions.CloseDetails)
	public async closeDetails() {

		const {MemberDetailsContainerComponent} = await import("@member/presentation/component/details-container/member-details-container.component");

		await this.whacAMaleProvider.destroyComponent(MemberDetailsContainerComponent);

	}

	@Action(MemberActions.CloseForm)
	public async closeForm() {

		const {MemberFormContainerComponent} = await import("@member/presentation/component/form/member-form-container/member-form-container.component");

		await this.whacAMaleProvider.destroyComponent(MemberFormContainerComponent);

	}

	@Action(MemberActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IMemberState>, {payload}: MemberActions.UpdateOpenedDetails) {

		import("@member/presentation/component/details-container/member-details-container.component")
			.then(async ({MemberDetailsContainerComponent}) => {

				const componentMirror = reflectComponentType(MemberDetailsContainerComponent);

				if (!componentMirror) {
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'value of `component` property is not a component');
					return;
				}

				const componentRefList = this.whacAMaleProvider.componentRefMapByComponentName.get(componentMirror.selector);

				if (!componentRefList?.length) {
					this.ngxLogger.debug('MemberState.updateOpenedDetails Did not find', componentMirror.selector, this);
					return;
				}

				const {0: componentRef} = componentRefList;

				const {renderedComponentRef} = componentRef.instance;

				if (!renderedComponentRef) {
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'renderedComponentRef is not defined');
					return;
				}

				if ('item' in renderedComponentRef.instance) {
					const {_id} = renderedComponentRef.instance.item;
					if (_id === payload._id) {
						renderedComponentRef.setInput('item', payload);
						return;
					}
					this.ngxLogger.error('MemberState.updateOpenedDetails', 'Item not found');
				}
			});


	}

	@Action(MemberActions.OpenDetails)
	public async openDetails(ctx: StateContext<IMemberState>, {payload}: MemberActions.OpenDetails) {

		const title = await this.translateService.instant('member.details.title');

		const {MemberDetailsContainerComponent} = await import("@member/presentation/component/details-container/member-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			componentInputs: {
				item: payload
			},
			component: MemberDetailsContainerComponent,
		});

	}

	@Action(MemberActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IMemberState>, {payload: id}: MemberActions.OpenDetailsById) {

		const title = await this.translateService.instant('member.details.title');
		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		const {MemberDetailsContainerComponent} = await import("@member/presentation/component/details-container/member-details-container.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: MemberDetailsContainerComponent,
			componentInputs: {
				item
			},
		});

	}

	@Action(MemberActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IMemberState>, {payload: id}: MemberActions.OpenFormToEditById) {

		const title = this.translateService.instant('member.form.title.edit');
		const item = await this.sharedUow.member.repository.findByIdAsync(id);

		if (!item) {
			this.ngxLogger.error('MemberState.openDetailsById', 'Item not found');
			return;
		}

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					id,
				},
				componentInputs: {
					item,
					isEditMode: true
				}
			}
		});

	}

	@Action(MemberActions.OpenForm)
	public async openForm(ctx: StateContext<IMemberState>, {payload}: MemberActions.OpenForm): Promise<void> {

		const {MemberFormContainerComponent} = await import("@member/presentation/component/form/member-form-container/member-form-container.component");

		const {componentInputs, pushBoxInputs} = payload ?? {};

		await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('member.form.title.create'),
			...pushBoxInputs,
			component: MemberFormContainerComponent,
			componentInputs,
		});

	}

	// API

	@Action(MemberActions.Init)
	public async init(ctx: StateContext<IMemberState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(MemberActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IMemberState>, action: MemberActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(MemberActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IMemberState>, action: MemberActions.UpdateTableState) {
		BaseState.updateTableState<EMember>(ctx, action);
	}

	@Action(MemberActions.CreateItem)
	public async createItem(ctx: StateContext<IMemberState>, action: MemberActions.CreateItem): Promise<void> {
		await this.sharedUow.member.repository.createAsync(EMember.fromDTO(action.payload));
		ctx.dispatch(new MemberActions.GetList());
		await this.closeForm();
	}

	@Action(MemberActions.UpdateItem)
	public async updateItem(ctx: StateContext<IMemberState>, {payload: item}: MemberActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.member.repository.findByIdAsync(item._id);
		if (foundItem) {

			const entity = EMember.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.member.repository.updateAsync(entity);
			ctx.dispatch(new MemberActions.GetList());
			await this.closeForm();
			await this.updateOpenedDetails(ctx, {payload: entity});

		}
	}

	@Action(MemberActions.GetItem)
	public async getItem(ctx: StateContext<IMemberState>, action: MemberActions.GetItem): Promise<void> {
		const raw = await this.sharedUow.member.repository.findByIdAsync(action.payload);

		if (!raw) {
			return;
		}

		const entity = EMember.fromRaw(raw);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});
	}

	@Action(MemberActions.GetList)
	public async getList(ctx: StateContext<IMemberState>, action: MemberActions.GetList): Promise<void> {

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

			const params = newTableState.toBackendFormat();

			const inState = (
				params?.state ?
					[params.state] :
					[StateEnum.active, StateEnum.archived, StateEnum.inactive]
			);

			const {items, totalSize} = await this.sharedUow.member.repository.findAsync({
				...params,
				state: inState,
			});

			const entities = items.map(EMember.fromRaw);

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

	// Selectors

	@Selector()
	public static itemData(state: IMemberState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IMemberState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IMemberState) {
		return state.tableState;
	}

	@Selector()
	public static activeMembers(state: IMemberState) {
		return state.tableState.items.filter((member) => member.profileStatus === MemberProfileStatusEnum.active);
	}

}
