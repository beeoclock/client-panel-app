import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Member from "@member/domain";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {MemberActions} from "@member/state/member/member.actions";
import {ArchiveMemberApiAdapter} from "@member/adapter/external/api/archive.member.api.adapter";
import {CreateMemberApiAdapter} from "@member/adapter/external/api/create.member.api.adapter";
import {UpdateMemberApiAdapter} from "@member/adapter/external/api/update.member.api.adapter";
import {ItemMemberApiAdapter} from "@member/adapter/external/api/item.member.api.adapter";
import {RemoveMemberApiAdapter} from "@member/adapter/external/api/remove.member.api.adapter";
import {ListMemberApiAdapter} from "@member/adapter/external/api/list.member.api.adapter";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";

export type IMemberState = IBaseState<Member.RIMember>;

const defaults = baseDefaults<Member.RIMember>({
	filters: {
		active: ActiveEnum.YES
	},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
});

@State<IMemberState>({
	name: 'member',
	defaults,
})
@Injectable()
export class MemberState extends BaseState<Member.RIMember> {

	protected override readonly archive = inject(ArchiveMemberApiAdapter);
	protected override readonly create = inject(CreateMemberApiAdapter);
	protected override readonly update = inject(UpdateMemberApiAdapter);
	protected override readonly item = inject(ItemMemberApiAdapter);
	protected override readonly remove = inject(RemoveMemberApiAdapter);
	protected override readonly list = inject(ListMemberApiAdapter);

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(MemberActions.CloseForm)
	public async closeForm(ctx: StateContext<IMemberState>, action?: MemberActions.CloseForm) {

		if (action?.payload) {
			this.pushBoxService.destroy$.next(action?.payload);
			return;
		}

		const {MemberFormContainerComponent} = await import("@member/presentation/component/form/member-form-container/member-form-container.component");

		this.pushBoxService.destroy$.next(MemberFormContainerComponent.name);

	}

	@Action(MemberActions.OpenDetailsById)
	public async openDetailsById(ctx: StateContext<IMemberState>, {payload: id}: MemberActions.OpenDetailsById) {

		const title = await this.translateService.instant('member.details.title');

		const {MemberDetailsContainerComponent} = await import("@member/presentation/component/details-container/member-details-container.component");

		await this.pushBoxService.buildItAsync({
			id,
			title,
			showLoading: true,
			useComponentNameAsPrefixOfId: true,
			component: MemberDetailsContainerComponent,
		});

		const item = await this.item.executeAsync(id);

		await this.pushBoxService.updatePushBoxComponentAsync({
			id,
			useComponentNameAsPrefixOfId: true,
			component: MemberDetailsContainerComponent,
			componentInputs: {
				item
			},
		});

	}

	@Action(MemberActions.OpenFormToEditById)
	public async openFormToEditById(ctx: StateContext<IMemberState>, {payload: id}: MemberActions.OpenFormToEditById) {

		const title = this.translateService.instant('member.form.title.edit');

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					showLoading: true,
					id,
				},
			}
		});

		const item = await this.item.executeAsync(id);

		await this.openForm(ctx, {
			payload: {
				pushBoxInputs: {
					title,
					showLoading: false,
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

		await this.pushBoxService.buildItAsync({
			title: this.translateService.instant('member.form.title.create'),
			...pushBoxInputs,
			component: MemberFormContainerComponent,
			componentInputs,
		});

	}

	// API

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
		await this.closeForm(ctx);
	}

	@Action(MemberActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IMemberState>, action: MemberActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeForm(ctx);
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
