import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@shared/state/app/app.actions";
import {TableState} from "@shared/domain/table.state";
import {getMaxPage} from "@shared/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {SPECIALIST_LIMIT} from "@tenant/tenant.token";
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {RoleDataActions} from "@tenant/member/roles/infrastructure/state/data/role.data.actions";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

export type IRoleState = IBaseState<ERole>;

const defaults = baseDefaults<ERole>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IRoleState>({
	name: 'roleData',
	defaults,
})
@Injectable()
export class RoleDataState {

	private readonly sharedUow = inject(SharedUow);

	private readonly ngxLogger = inject(NGXLogger);
	private readonly specialistLimit$ = inject(SPECIALIST_LIMIT);

	// API

	@Action(RoleDataActions.Init)
	public async init(ctx: StateContext<IRoleState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(RoleDataActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IRoleState>, action: RoleDataActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(RoleDataActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IRoleState>, action: RoleDataActions.UpdateTableState) {
		BaseState.updateTableState<ERole>(ctx, action);
	}

	@Action(RoleDataActions.CreateItem)
	public async createItem(ctx: StateContext<IRoleState>, action: RoleDataActions.CreateItem): Promise<void> {
		const specialistLimit = this.specialistLimit$.value;

		const actualMembersCount = await this.sharedUow.role.count();

		if (is.number(specialistLimit) && specialistLimit <= actualMembersCount) {
			return;
		}

		await this.sharedUow.role.repository.createAsync(ERole.fromDTO(action.payload));
		ctx.dispatch(new RoleDataActions.GetList());
		ctx.dispatch(new RolePresentationActions.CloseForm());
	}

	@Action(RoleDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IRoleState>, {payload: item}: RoleDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.role.repository.findByIdAsync(item._id);
		if (foundItem) {

			const entity = ERole.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.role.repository.updateAsync(entity);
			ctx.dispatch(new RoleDataActions.GetList());
			ctx.dispatch(new RolePresentationActions.CloseForm());
			ctx.dispatch(new RolePresentationActions.UpdateOpenedDetails(entity));

		}
	}

	@Action(RoleDataActions.GetItem)
	public async getItem(ctx: StateContext<IRoleState>, action: RoleDataActions.GetItem): Promise<void> {
		const raw = await this.sharedUow.role.repository.findByIdAsync(action.payload);

		if (!raw) {
			return;
		}

		const entity = ERole.fromRaw(raw);

		ctx.patchState({
			item: {
				data: entity,
				downloadedAt: new Date(),
			}
		});
	}

	@Action(RoleDataActions.GetList)
	public async getList(ctx: StateContext<IRoleState>, action: RoleDataActions.GetList): Promise<void> {

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
					[StateEnum.active, StateEnum.archived, StateEnum.inactive, StateEnum.deleted]
			);

			const {items, totalSize} = await this.sharedUow.role.repository.findAsync({
				...params,
				state: inState,
			});

			const entities = items.map(ERole.fromRaw);

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

	@Action(RoleDataActions.SetState)
	public async setState(ctx: StateContext<IRoleState>, {item, state}: RoleDataActions.SetState) {
		const foundItems = await this.sharedUow.role.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = ERole.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.role.repository.updateAsync(entity);
			ctx.dispatch(new RolePresentationActions.UpdateOpenedDetails(entity));
			ctx.dispatch(new RoleDataActions.GetList());
		}
	}

	@Action(RoleDataActions.SetStatus)
	public async setStatus(ctx: StateContext<IRoleState>, {item}: RoleDataActions.SetStatus) {
		const foundItems = await this.sharedUow.role.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = ERole.fromRaw(foundItems);
			// entity.changeStatus(status);
			await this.sharedUow.role.repository.updateAsync(entity);
			ctx.dispatch(new RolePresentationActions.UpdateOpenedDetails(entity));
			ctx.dispatch(new RoleDataActions.GetList());
		}
	}

	// Selectors

	@Selector()
	public static tableState(state: IRoleState) {
		return state.tableState;
	}

	@Selector()
	public static activeRoles(state: IRoleState) {
		return state.tableState.items.filter((role) => role.state === StateEnum.active);
	}

}
