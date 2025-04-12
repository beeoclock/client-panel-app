import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";
import {NGXLogger} from "ngx-logger";
import EMember from "@tenant/member/member/domain/entity/e.member";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@shared/state/app/app.actions";
import {TableState} from "@shared/domain/table.state";
import {getMaxPage} from "@shared/domain/max-page";
import {StateEnum} from "@core/shared/enum/state.enum";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {is} from "@core/shared/checker";
import {SPECIALIST_LIMIT} from "@tenant/tenant.token";
import {
	MemberPresentationActions
} from "@tenant/member/member/infrastructure/state/presentation/member.presentation.actions";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";

export type IMemberState = IBaseState<EMember>;

const defaults = baseDefaults<EMember>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IMemberState>({
	name: 'memberData',
	defaults,
})
@Injectable()
export class MemberDataState {

	private readonly sharedUow = inject(SharedUow);

	private readonly ngxLogger = inject(NGXLogger);
	private readonly specialistLimit$ = inject(SPECIALIST_LIMIT);

	// API

	@Action(MemberDataActions.Init)
	public async init(ctx: StateContext<IMemberState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(MemberDataActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IMemberState>, action: MemberDataActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(MemberDataActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IMemberState>, action: MemberDataActions.UpdateTableState) {
		BaseState.updateTableState<EMember>(ctx, action);
	}

	@Action(MemberDataActions.CreateItem)
	public async createItem(ctx: StateContext<IMemberState>, action: MemberDataActions.CreateItem): Promise<void> {
		const specialistLimit = this.specialistLimit$.value;

		const actualMembersCount = await this.sharedUow.member.count();

		if (is.number(specialistLimit) && specialistLimit <= actualMembersCount) {
			return;
		}

		await this.sharedUow.member.repository.createAsync(EMember.fromDTO(action.payload));
		ctx.dispatch(new MemberDataActions.GetList());
		ctx.dispatch(new MemberPresentationActions.CloseForm());
	}

	@Action(MemberDataActions.UpdateItem)
	public async updateItem(ctx: StateContext<IMemberState>, {payload: item}: MemberDataActions.UpdateItem): Promise<void> {
		const foundItem = await this.sharedUow.member.repository.findByIdAsync(item._id);
		if (foundItem) {

			const entity = EMember.fromRaw({
				...foundItem,
				...item,
			});
			await this.sharedUow.member.repository.updateAsync(entity);
			ctx.dispatch(new MemberDataActions.GetList());
			ctx.dispatch(new MemberPresentationActions.CloseForm());
			ctx.dispatch(new MemberPresentationActions.UpdateOpenedDetails(entity));

		}
	}

	@Action(MemberDataActions.GetItem)
	public async getItem(ctx: StateContext<IMemberState>, action: MemberDataActions.GetItem): Promise<void> {
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

	@Action(MemberDataActions.GetList)
	public async getList(ctx: StateContext<IMemberState>, action: MemberDataActions.GetList): Promise<void> {

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

	@Action(MemberDataActions.SetState)
	public async setState(ctx: StateContext<IMemberState>, {item, state}: MemberDataActions.SetState) {
		const foundItems = await this.sharedUow.member.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EMember.fromRaw(foundItems);
			entity.changeState(state);
			await this.sharedUow.member.repository.updateAsync(entity);
			ctx.dispatch(new MemberPresentationActions.UpdateOpenedDetails(entity));
			ctx.dispatch(new MemberDataActions.GetList());
		}
	}

	@Action(MemberDataActions.SetStatus)
	public async SetStatus(ctx: StateContext<IMemberState>, {item, status}: MemberDataActions.SetStatus) {
		const foundItems = await this.sharedUow.member.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EMember.fromRaw(foundItems);
			entity.changeStatus(status);
			await this.sharedUow.member.repository.updateAsync(entity);
			ctx.dispatch(new MemberPresentationActions.UpdateOpenedDetails(entity));
			ctx.dispatch(new MemberDataActions.GetList());
		}
	}

	// Selectors

	@Selector()
	public static tableState(state: IMemberState) {
		return state.tableState;
	}

	@Selector()
	public static activeMembers(state: IMemberState) {
		return state.tableState.items.filter((member) => member.profileStatus === MemberProfileStatusEnum.active);
	}

}
