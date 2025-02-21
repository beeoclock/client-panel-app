import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {baseDefaults, BaseState, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {PaymentActions} from "@module/payment/infrastructure/state/payment/payment.actions";
import EPayment from "@src/core/business-logic/payment/entity/e.payment";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {TableState} from "@utility/domain/table.state";
import {StateEnum} from "@core/shared/enum/state.enum";
import {getMaxPage} from "@utility/domain/max-page";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@src/core/business-logic/payment/interface/i.payment";
import {PaymentService} from "@core/business-logic/payment/service/payment.service";
import {environment} from "@environment/environment";

export type IPaymentState = IBaseState<IPayment.DTO>;

const defaults = baseDefaults<IPayment.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IPaymentState>({
	name: 'payment',
	defaults,
})
@Injectable()
export class PaymentState {

	private readonly paymentService = inject(PaymentService);
	private readonly ngxLogger = inject(NGXLogger);

	// Application layer

	@Action(PaymentActions.CloseDetails)
	public async closeDetailsAction(ctx: StateContext<IPaymentState>, action?: PaymentActions.CloseDetails) {

		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// this.whacAMaleProvider.destroyByComponentName$.next(PaymentDetailsContainerComponent.name);

	}

	@Action(PaymentActions.CloseForm)
	public async closeFormAction(ctx: StateContext<IPaymentState>, action?: PaymentActions.CloseForm) {

		//
		// const {PaymentFormContainerComponent} = await import("@payment/presentation/component/form/payment-form-container.component");
		//
		// this.whacAMaleProvider.destroyByComponentName$.next(PaymentFormContainerComponent.name);

	}

	@Action(PaymentActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IPaymentState>, {payload}: PaymentActions.UpdateOpenedDetails) {

		// const {PaymentDetailsContainerComponent} = await import("@payment/presentation/component/details/payment-details-container.component");
		//
		// await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
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
		// await this.whacAMaleProvider.buildItAsync({
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
		// await this.whacAMaleProvider.buildItAsync({
		// 	id,
		// 	title,
		// 	showLoading: true,
		// 	component: PaymentDetailsContainerComponent,
		// });
		//
		// const item = await this.item.executeAsync(id);
		//
		// await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
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
		// await this.whacAMaleProvider.buildItAsync({
		// 	title,
		// 	id: action.payload,
		// 	component: PaymentFormContainerComponent,
		// 	componentInputs: {},
		// });
		//
		// const item = await this.item.executeAsync(action.payload);
		//
		// await this.whacAMaleProvider.buildItAsync({
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
		// await this.whacAMaleProvider.buildItAsync({
		// 	id: PaymentFormContainerComponent.name,
		// 	title: this.translateService.instant('payment.form.title.create'),
		// 	...pushBoxInputs,
		// 	component: PaymentFormContainerComponent,
		// 	componentInputs,
		// });

	}

	// API

	@Action(PaymentActions.Init)
	public async init(ctx: StateContext<IPaymentState>): Promise<void> {
		ctx.setState(structuredClone(defaults));
	}

	@Action(PaymentActions.UpdateFilters)
	public updateFilters(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateFilters) {
		BaseState.updateFilters(ctx, action);
	}

	@Action(PaymentActions.UpdateTableState)
	public updateTableState(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateTableState) {
		BaseState.updateTableState(ctx, action);
	}

	@Action(PaymentActions.CreateItem)
	public async createItem(ctx: StateContext<IPaymentState>, action: PaymentActions.CreateItem) {
		await this.paymentService.repository.createAsync(EPayment.create(action.payload));
		await this.closeFormAction(ctx);
		ctx.dispatch(new PaymentActions.GetList());
	}

	@Action(PaymentActions.UpdateItem)
	public async updateItem(ctx: StateContext<IPaymentState>, action: PaymentActions.UpdateItem): Promise<void> {
		const item = EPayment.create(action.payload);
		await this.paymentService.repository.updateAsync(item);
		await this.closeFormAction(ctx);
		await this.updateOpenedDetailsAction(ctx, {payload: item});
		ctx.dispatch(new PaymentActions.GetList());
	}

	@Action(PaymentActions.GetItem)
	public async getItem(ctx: StateContext<IPaymentState>, {payload: id}: PaymentActions.GetItem): Promise<void> {

		const data = await this.paymentService.repository.findByIdAsync(id);

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

	@Action(PaymentActions.GetList)
	public async getList(ctx: StateContext<IPaymentState>, action: PaymentActions.GetList): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const newTableState = TableState.fromCache(state.tableState);

			const {
				// queryParams,
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

			const {items, totalSize} = await this.paymentService.repository.findAsync({
				...params,
				state: inState,
			});

			newTableState
				.setTotal(totalSize)
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

	@Action(PaymentActions.PutItem)
	public async putItem(ctx: StateContext<IPaymentState>, action: PaymentActions.PutItem): Promise<void> {
		const item = EPayment.create(action.payload.item);
		await this.paymentService.repository.updateAsync(item);
		// await this.closeFormAction(ctx);
		// await this.updateOpenedDetailsAction(ctx, {payload: item});
		// ctx.dispatch(new PaymentActions.GetList());
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
