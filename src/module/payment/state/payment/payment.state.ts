import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";
import {CreatePaymentApiAdapter} from "@module/payment/external/adapter/api/create.payment.api.adapter";
import {UpdatePaymentApiAdapter} from "@module/payment/external/adapter/api/update.payment.api.adapter";
import {DetailsPaymentApiAdapter} from "@module/payment/external/adapter/api/details.payment.api.adapter";
import {DeletePaymentApiAdapter} from "../../external/adapter/api/delete.payment.api.adapter";
import {PagedPaymentApiAdapter} from "@module/payment/external/adapter/api/paged.payment.api.adapter";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";
import {PaymentActions} from "@module/payment/state/payment/payment.actions";

export type IPaymentState = IBaseState<IPaymentDto>;

const defaults = baseDefaults<IPaymentDto>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
});

@State<IPaymentState>({
	name: 'payment',
	defaults,
})
@Injectable()
export class PaymentState extends BaseState<IPaymentDto> {

	protected override readonly create = inject(CreatePaymentApiAdapter);
	protected override readonly update = inject(UpdatePaymentApiAdapter);
	protected override readonly item = inject(DetailsPaymentApiAdapter);
	protected override readonly delete = inject(DeletePaymentApiAdapter);
	protected override readonly paged = inject(PagedPaymentApiAdapter);

	private readonly translateService = inject(TranslateService);

	constructor() {
		super(
			defaults,
		);
	}

	// Application layer

	@Action(PaymentActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IPaymentState>, action?: PaymentActions.CloseDetails) {

		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// this.pushBoxService.destroyByComponentName$.next(PaymentDetailsContainerComponent.name);

	}

	@Action(PaymentActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IPaymentState>, action?: PaymentActions.CloseForm) {

		//
		// const {PaymentFormContainerComponent} = await import("@payment/presentation/component/form/payment-form-container.component");
		//
		// this.pushBoxService.destroyByComponentName$.next(PaymentFormContainerComponent.name);

	}

	@Action(PaymentActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IPaymentState>, {payload}: PaymentActions.UpdateOpenedDetails) {

		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// await this.pushBoxService.updatePushBoxComponentAsync({
		// 	id: payload._id,
		// 	component: PaymentDetailsContainerComponent,
		// 	componentInputs: {item: payload},
		// });

	}

	@Action(PaymentActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IPaymentState>, {payload}: PaymentActions.OpenDetails) {

		// const title = await this.translateService.instant('payment.details.title');
		//
		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// await this.pushBoxService.buildItAsync({
		// 	id,
		// 	title,
		// 	componentInputs: {item: payload},
		// 	component: PaymentDetailsContainerComponent,
		// });

	}

	@Action(PaymentActions.OpenDetailsById)
	public async openDetailsByIdAction(ctx: StateContext<IPaymentState>, {payload: id}: PaymentActions.OpenDetailsById) {

		// const title = await this.translateService.instant('payment.details.title');
		//
		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// await this.pushBoxService.buildItAsync({
		// 	id,
		// 	title,
		// 	showLoading: true,
		// 	component: PaymentDetailsContainerComponent,
		// });
		//
		// const item = await this.item.executeAsync(id);
		//
		// await this.pushBoxService.updatePushBoxComponentAsync({
		// 	component: PaymentDetailsContainerComponent,
		// 	componentInputs: {item},
		// });

	}

	@Action(PaymentActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IPaymentState>, action: PaymentActions.OpenFormToEditById) {

		// const title = await this.translateService.instant('payment.form.title.edit');
		//
		// const {PaymentFormContainerComponent} = await import("@payment/presentation/component/form/payment-form-container.component");
		//
		// await this.pushBoxService.buildItAsync({
		// 	title,
		// 	id: action.payload,
		// 	component: PaymentFormContainerComponent,
		// 	componentInputs: {},
		// });
		//
		// const item = await this.item.executeAsync(action.payload);
		//
		// await this.pushBoxService.buildItAsync({
		// 	title,
		// 	id: action.payload,
		// 	component: PaymentFormContainerComponent,
		// 	componentInputs: {
		// 		item,
		// 		isEditMode: true,
		// 	},
		// });

	}

	@Action(PaymentActions.OpenForm)
	public async openFormAction(ctx: StateContext<IPaymentState>, {payload}: PaymentActions.OpenForm): Promise<void> {

		// const {PaymentFormContainerComponent} = await import("@payment/presentation/component/form/payment-form-container.component");
		//
		// const {componentInputs, pushBoxInputs} = payload ?? {};
		//
		// await this.pushBoxService.buildItAsync({
		// 	id: PaymentFormContainerComponent.name,
		// 	title: this.translateService.instant('payment.form.title.create'),
		// 	...pushBoxInputs,
		// 	component: PaymentFormContainerComponent,
		// 	componentInputs,
		// });

	}

	// API

	@Action(PaymentActions.Init)
	public override async init(ctx: StateContext<IPaymentState>): Promise<void> {
		await super.init(ctx);
	}

	@Action(PaymentActions.UpdateFilters)
	public override updateFilters(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateFilters) {
		super.updateFilters(ctx, action);
	}

	@Action(PaymentActions.UpdateTableState)
	public override updateTableState(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateTableState) {
		super.updateTableState(ctx, action);
	}

	@Action(PaymentActions.CreateItem)
	public override async createItem(ctx: StateContext<IPaymentState>, action: PaymentActions.CreateItem) {
		await super.createItem(ctx, action);
		await this.closeFormAction(ctx);
	}

	@Action(PaymentActions.UpdateItem)
	public override async updateItem(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateItem): Promise<void> {
		await super.updateItem(ctx, action);
		await this.closeFormAction(ctx, {
			payload: action.payload._id
		});
		const {data} = ctx.getState().item;
		data && await this.updateOpenedDetailsAction(ctx, {payload: data});
	}

	@Action(PaymentActions.GetItem)
	public override async getItem(ctx: StateContext<IPaymentState>, action: PaymentActions.GetItem): Promise<void> {
		await super.getItem(ctx, action);
	}

	@Action(PaymentActions.DeleteItem)
	public override async deleteItem(ctx: StateContext<IPaymentState>, action: PaymentActions.DeleteItem) {
		await super.deleteItem(ctx, action);
		await this.closeDetailsAction(ctx, action);
	}

	@Action(PaymentActions.GetList)
	public override async getList(ctx: StateContext<IPaymentState>, action: PaymentActions.GetList): Promise<void> {
		await super.getList(ctx, action);
	}

	// Selectors

	@Selector()
	public static itemData(state: IPaymentState) {
		return state.item.data;
	}

	@Selector()
	public static tableStateItems(state: IPaymentState) {
		return state.tableState.items;
	}

	@Selector()
	public static tableState(state: IPaymentState) {
		return state.tableState;
	}

	@Selector()
	public static tableStateFilters(state: IPaymentState) {
		return state.tableState.filters;
	}

}
