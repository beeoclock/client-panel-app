import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext, Store} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {TranslateService} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import {NGXLogger} from "ngx-logger";
import EOrder from "@tenant/order/domain/entity/e.order";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";
import {ModalController} from "@ionic/angular/standalone";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import OrderDetailsContainerComponent
	from "@tenant/order/presentation/ui/component/details/order-details-container.component";
import OrderFormContainerComponent from "@tenant/order/presentation/ui/component/form/order-form-container.component";

export type IOrderState = IBaseState<EOrder>;

const defaults = baseDefaults<EOrder>({
	filters: {
		statuses: [
			OrderStatusEnum.confirmed,
			OrderStatusEnum.done,
			OrderStatusEnum.cancelled,
		]
	},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IOrderState>({
	name: 'orderServicePresentation',
	defaults,
})
@Injectable()
export class OrderServicePresentationState {

	private readonly sharedUow = inject(SharedUow);

	private readonly store = inject(Store);
	private readonly modalController = inject(ModalController);

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	@Action(OrderActions.CloseDetails)
	public async closeDetailsAction() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderActions.CloseForm)
	public async closeFormAction() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.UpdateOpenedDetails) {
		await this.router.navigate([{outlets: {second: ['order-service', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});
	}

	@Action(OrderActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenDetails) {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof OrderDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					ctx.dispatch(new OrderActions.CloseDetails());
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['order-service', payload._id]}}]);

	}

	@Action(OrderActions.OpenFormToEditById)
	public async openFormToEditByIdAction(ctx: StateContext<IOrderState>, action: OrderActions.OpenFormToEditById) {

		const orderDto = await this.sharedUow.order.repository.findByIdAsync(action.payload);

		if (!orderDto) {
			this.ngxLogger.error('OrderState.openDetailsById', 'Item not found');
			return;
		}

		ctx.dispatch(new OrderActions.OpenForm({
			componentInputs: {
				item: orderDto,
				isEditMode: true
			},
		}));

	}

	@Action(OrderActions.OpenForm)
	public async openFormAction(ctx: StateContext<IOrderState>, {payload}: OrderActions.OpenForm): Promise<void> {

		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof OrderFormContainerComponent) {
				const isEditMode = activated.isEditMode();
				if (isEditMode) {
					const {_id} = activated.order() ?? {};
					if (_id === payload?.componentInputs?.item?._id) {
						const action = new OrderActions.CloseForm();
						ctx.dispatch(action);
						return;
					}
				} else {
					const action = new OrderActions.CloseForm();
					ctx.dispatch(action);
					return;
				}
			}
		}

		if (payload?.componentInputs?.isEditMode) {
			await this.router.navigate([{outlets: {second: ['order-service', payload.componentInputs.item?._id, 'form']}}]);
		} else {

			let customerJSON = '';
			let memberJSON = '';
			let appointmentStartDateTimeIso = '';
			let serviceListJSON = '';

			const {componentInputs} = payload ?? {};
			if (componentInputs) {
				const {setupPartialData} = componentInputs;
				if (setupPartialData) {
					const {
						customer,
						defaultMemberForService: member,
						defaultAppointmentStartDateTimeIso,
						serviceList
					} = setupPartialData;
					if (customer) {
						customerJSON = JSON.stringify(customer);
					}
					if (member) {
						memberJSON = JSON.stringify(member);
					}
					if (defaultAppointmentStartDateTimeIso) {
						appointmentStartDateTimeIso = defaultAppointmentStartDateTimeIso;
					}
					if (serviceList) {
						serviceListJSON = JSON.stringify(serviceList);
					}
				}
			}

			await this.router.navigate([{outlets: {second: ['order-service', 'form']}}], {
				queryParams: {
					customerJSON,
					memberJSON,
					appointmentStartDateTimeIso,
					serviceListJSON,
				}
			});

		}

	}


}
