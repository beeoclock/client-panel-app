import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext, Store} from "@ngxs/store";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {ModalController} from "@ionic/angular/standalone";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import {
	OrderServicePresentationActions
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.actions";
import {EventActions} from "@tenant/event/infrastructure/state/event/event.actions";

export type IOrderState = object;

const defaults = {};

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

	@Action(OrderServicePresentationActions.CloseDetails)
	public async closeDetailsAction() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderServicePresentationActions.CloseForm)
	public async closeFormAction() {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(OrderServicePresentationActions.UpdateOpenedDetails)
	public async updateOpenedDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderServicePresentationActions.UpdateOpenedDetails) {
		await this.router.navigate([{outlets: {second: ['order-service', payload._id]}}], {
			onSameUrlNavigation: 'reload',
		});
	}

	@Action(OrderServicePresentationActions.OpenDetails)
	public async openDetailsAction(ctx: StateContext<IOrderState>, {payload}: OrderServicePresentationActions.OpenDetails) {

		const action = new EventActions.ToggleDetails(payload._id);
		ctx.dispatch(action);

		//
		// const activated = this.secondRouterOutletService.activated();
		//
		// if (activated) {
		// 	if (activated instanceof OrderDetailsContainerComponent) {
		// 		const {_id} = activated.item() ?? {};
		// 		if (_id === payload._id) {
		// 			ctx.dispatch(new OrderServicePresentationActions.CloseDetails());
		// 			return;
		// 		}
		// 	}
		// }
		//
		// await this.router.navigate([{outlets: {second: ['order-service', payload._id]}}]);

	}


}
