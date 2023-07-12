import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import * as Member from "@member/domain";
import {Router} from "@angular/router";
import {MemberRepository} from "@member/repository/member.repository";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {MemberActions} from "@member/state/member/member.actions";

export type IMemberState = IBaseState<Member.IMember>;

@State<IMemberState>({
  name: 'member',
  defaults: baseDefaults<Member.IMember>()
})
@Injectable()
export class MemberState extends BaseState<Member.IMember> {

  public override readonly router = inject(Router);
  public override readonly repository = inject(MemberRepository);

  constructor() {
    super(
      MemberActions,
      {
        tableStates: 'member.cache.tableStates',
        items: 'member.cache.items'
      }
    );
  }

  @Action(MemberActions.InitDefaultsFromCache)
  public override async InitDefaultsFromCache(ctx: StateContext<IMemberState>): Promise<void> {
    await super.InitDefaultsFromCache(ctx);
  }

  @Action(MemberActions.UpdateFilters)
  public override async UpdateFilters(ctx: StateContext<IMemberState>, action: MemberActions.UpdateFilters): Promise<void> {
    await super.UpdateFilters(ctx, action);
  }

  @Action(MemberActions.UpdateTableState)
  public override async UpdateTableState(ctx: StateContext<IMemberState>, action: MemberActions.UpdateTableState): Promise<void> {
    return super.UpdateTableState(ctx, action);
  }

  @Action(MemberActions.GetItem)
  public override async GetItem(ctx: StateContext<IMemberState>, action: MemberActions.GetItem): Promise<void> {
    await super.GetItem(ctx, action);
  }

  @Action(MemberActions.DeleteItem)
  public override deleteItem(ctx: StateContext<IMemberState>, action: MemberActions.DeleteItem): void {
    super.deleteItem(ctx, action);
  }

  @Action(MemberActions.SaveItem)
  public override async saveItem(ctx: StateContext<IMemberState>, action: MemberActions.SaveItem): Promise<void> {
    await super.saveItem(ctx, action);
  }

  @Action(MemberActions.GetList)
  public override async getList(ctx: StateContext<IMemberState>): Promise<void> {
    await super.getList(ctx, (queryFilters: any, filters: any) => {

      const {search} = filters;


      if (search) {
        queryFilters['$or'] = [
          {
            firstName: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            secondName: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            lastName: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            email: {
              $regex: search ?? '',
              $options: "i"
            }
          },
          {
            phone: {
              $regex: search ?? '',
              $options: "i"
            }
          },
        ];
      }

    });

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
