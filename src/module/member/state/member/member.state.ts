import {inject, Injectable} from "@angular/core";
import {Action, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import * as Member from "@member/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {MemberActions} from "@member/state/member/member.actions";
import {ArchiveMemberApiAdapter} from "@member/adapter/external/api/archive.member.api.adapter";
import {CreateMemberApiAdapter} from "@member/adapter/external/api/create.member.api.adapter";
import {UpdateMemberApiAdapter} from "@member/adapter/external/api/update.member.api.adapter";
import {ItemMemberApiAdapter} from "@member/adapter/external/api/item.member.api.adapter";
import {RemoveMemberApiAdapter} from "@member/adapter/external/api/remove.member.api.adapter";
import {ListMemberApiAdapter} from "@member/adapter/external/api/list.member.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";

export type IMemberState = IBaseState<Member.RIMember>;

const defaults = baseDefaults<Member.RIMember>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
});

@State<IMemberState>({
	name: 'member',
	defaults,
})
@Injectable()
export class MemberState extends BaseState<Member.RIMember> implements NgxsOnInit {

	protected override readonly archive = inject(ArchiveMemberApiAdapter);
	protected override readonly create = inject(CreateMemberApiAdapter);
	protected override readonly update = inject(UpdateMemberApiAdapter);
	protected override readonly item = inject(ItemMemberApiAdapter);
	protected override readonly remove = inject(RemoveMemberApiAdapter);
	protected override readonly list = inject(ListMemberApiAdapter);

	constructor() {
		super(
			defaults,
		);
	}

	public ngxsOnInit(ctx: StateContext<IMemberState>): void {
		ctx.dispatch(new MemberActions.GetList());
	}

	@Action(MemberActions.Init)
	public override async init(ctx: StateContext<IMemberState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(MemberActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IMemberState>, action: MemberActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(MemberActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IMemberState>, action: MemberActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(MemberActions.GetItem)
	public override async getItem(ctx: StateContext<IMemberState>, action: MemberActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(MemberActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IMemberState>, action: MemberActions.DeleteItem) {
		await super.deleteItem(ctx, action);
	}

	@Action(MemberActions.CreateItem)
	public override async createItem(ctx: StateContext<IMemberState>, action: MemberActions.CreateItem): Promise<void> {
		await super.createItem(ctx, action);
	}

	@Action(MemberActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IMemberState>, action: MemberActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
	}

	@Action(MemberActions.GetList)
	public override async getList(ctx: StateContext<IMemberState>, action: MemberActions.GetList): Promise<void> {
		await super.getList(ctx, action);
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

}
