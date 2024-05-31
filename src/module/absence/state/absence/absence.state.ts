import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {AbsenceActions} from "@module/absence/state/absence/absence.actions";
import {IAbsenceDto} from "@module/absence/external/interface/i.absence.dto";
import {CreateAbsenceApiAdapter} from "@module/absence/external/adapter/api/create.order.api.adapter";
import {UpdateAbsenceApiAdapter} from "@module/absence/external/adapter/api/update.order.api.adapter";
import {DetailsAbsenceApiAdapter} from "@module/absence/external/adapter/api/details.order.api.adapter";
import {PagedAbsenceApiAdapter} from "@module/absence/external/adapter/api/paged.order.api.adapter";
import {DeleteAbsenceApiAdapter} from "@module/absence/external/adapter/api/delete.order.api.adapter";

export type IAbsenceState = IBaseState<IAbsenceDto>;

const defaults = baseDefaults<IAbsenceDto>({
    filters: {},
    orderBy: OrderByEnum.CREATED_AT,
    orderDir: OrderDirEnum.DESC,
});

@State<IAbsenceState>({
    name: 'absence',
    defaults,
})
@Injectable()
export class AbsenceState extends BaseState<IAbsenceDto> {

    protected override readonly create = inject(CreateAbsenceApiAdapter);
    protected override readonly update = inject(UpdateAbsenceApiAdapter);
    protected override readonly item = inject(DetailsAbsenceApiAdapter);
    protected override readonly delete = inject(DeleteAbsenceApiAdapter);
    protected override readonly paged = inject(PagedAbsenceApiAdapter);

    private readonly translateService = inject(TranslateService);

    constructor() {
        super(
            defaults,
        );
    }

    // Application layer

    @Action(AbsenceActions.CloseDetails)
    public async closeDetailsAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseDetails) {

        const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

        if (action?.payload) {
            this.pushBoxService.destroy$.next(AbsenceDetailsContainerComponent.name + '_' + action?.payload);
            return;
        }

        this.pushBoxService.destroyByComponentName$.next(AbsenceDetailsContainerComponent.name);

    }

    @Action(AbsenceActions.CloseForm)
    public async closeFormAction(ctx: StateContext<IAbsenceState>, action?: AbsenceActions.CloseForm) {

        if (action?.payload) {
            this.pushBoxService.destroy$.next(action?.payload);
            return;
        }

        const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

        this.pushBoxService.destroyByComponentName$.next(AbsenceFormContainerComponent.name);

    }

    @Action(AbsenceActions.UpdateOpenedDetails)
    public async updateOpenedDetailsAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.UpdateOpenedDetails) {

        const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

        await this.pushBoxService.updatePushBoxComponentAsync({
            id: payload._id,
            useComponentNameAsPrefixOfId: true,
            component: AbsenceDetailsContainerComponent,
            componentInputs: {item: payload},
        });

    }

    @Action(AbsenceActions.OpenDetailsById)
    public async openDetailsByIdAction(ctx: StateContext<IAbsenceState>, {payload: id}: AbsenceActions.OpenDetailsById) {

        const title = await this.translateService.instant('absence.details.title');

        const {AbsenceDetailsContainerComponent} = await import("@absence/presentation/component/details/absence-details-container.component");

        await this.pushBoxService.buildItAsync({
            id,
            title,
            showLoading: true,
            useComponentNameAsPrefixOfId: true,
            component: AbsenceDetailsContainerComponent,
        });

        const item = await this.item.executeAsync(id);

        await this.pushBoxService.updatePushBoxComponentAsync({
            id,
            useComponentNameAsPrefixOfId: true,
            component: AbsenceDetailsContainerComponent,
            componentInputs: {item},
        });

    }

    @Action(AbsenceActions.OpenFormToEditById)
    public async openFormToEditByIdAction(ctx: StateContext<IAbsenceState>, action: AbsenceActions.OpenFormToEditById) {

        const title = await this.translateService.instant('absence.form.title.edit');

        const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

        await this.pushBoxService.buildItAsync({
            title,
            id: action.payload,
            component: AbsenceFormContainerComponent,
            componentInputs: {},
        });

        const item = await this.item.executeAsync(action.payload);

        await this.pushBoxService.buildItAsync({
            title,
            id: action.payload,
            component: AbsenceFormContainerComponent,
            componentInputs: {
                item,
                isEditMode: true,
            },
        });

    }

    @Action(AbsenceActions.OpenForm)
    public async openFormAction(ctx: StateContext<IAbsenceState>, {payload}: AbsenceActions.OpenForm): Promise<void> {

        const {AbsenceFormContainerComponent} = await import("@absence/presentation/component/form/absence-form-container.component");

        const {componentInputs, pushBoxInputs} = payload ?? {};

        await this.pushBoxService.buildItAsync({
            id: AbsenceFormContainerComponent.name,
            title: this.translateService.instant('absence.form.title.create'),
            ...(pushBoxInputs ?? {}),
            component: AbsenceFormContainerComponent,
            componentInputs,
        });

    }

    // API

    @Action(AbsenceActions.Init)
    public override async init(ctx: StateContext<IAbsenceState>): Promise<void> {
        await super.init(ctx);
    }

    @Action(AbsenceActions.UpdateFilters)
    public override updateFilters(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateFilters) {
        super.updateFilters(ctx, action);
    }

    @Action(AbsenceActions.UpdateTableState)
    public override updateTableState(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateTableState) {
        super.updateTableState(ctx, action);
    }

    @Action(AbsenceActions.CreateItem)
    public override async createItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.CreateItem) {
        await super.createItem(ctx, action);
        await this.closeFormAction(ctx);
    }

    @Action(AbsenceActions.UpdateItem)
    public override async updateItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.UpdateItem): Promise<void> {
        await super.updateItem(ctx, action);
        await this.closeFormAction(ctx, {
            payload: action.payload._id
        });
        const {data} = ctx.getState().item;
        data && await this.updateOpenedDetailsAction(ctx, {payload: data});
    }

    @Action(AbsenceActions.GetItem)
    public override async getItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetItem): Promise<void> {
        await super.getItem(ctx, action);
    }

    @Action(AbsenceActions.DeleteItem)
    public override async deleteItem(ctx: StateContext<IAbsenceState>, action: AbsenceActions.DeleteItem) {
        await super.deleteItem(ctx, action);
        await this.closeDetailsAction(ctx, action);
    }

    @Action(AbsenceActions.GetList)
    public override async getList(ctx: StateContext<IAbsenceState>, action: AbsenceActions.GetList): Promise<void> {
        await super.getList(ctx, action);
    }

    // Selectors

    @Selector()
    public static itemData(state: IAbsenceState) {
        return state.item.data;
    }

    @Selector()
    public static tableStateItems(state: IAbsenceState) {
        return state.tableState.items;
    }

    @Selector()
    public static tableState(state: IAbsenceState) {
        return state.tableState;
    }

    @Selector()
    public static tableStateFilters(state: IAbsenceState) {
        return state.tableState.filters;
    }

}
