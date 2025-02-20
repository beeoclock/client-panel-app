import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@event/infrastructure/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {IOrderState} from "@order/infrastructure/state/order/order.state";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {OrderService} from "@core/business-logic/order/service/order.service";
import EOrder from "@core/business-logic/order/entity/e.order";


export interface IEventState {

}

@State<IEventState>({
	name: 'event',
	defaults: {},
})
@Injectable()
export class EventState {

	private readonly orderService = inject(OrderService);

	// Change status
	private readonly translateService = inject(TranslateService);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly ngxLogger = inject(NGXLogger);

	// Application layer

	@Action(EventActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IEventState>, {payload: item}: EventActions.UpdateOpenedDetails) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		this.ngxLogger.debug('EventState.updateOpenedDetails', item);
		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: ContainerDetailsComponent,
			componentInputs: {
				event: structuredClone(item)
			},
		}).catch((error) => {
			this.ngxLogger.error('EventState.updateOpenedDetails', error);
		});

	}

	@Action(EventActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IEventState>, action?: EventActions.CloseDetails) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.whacAMaleProvider.destroyComponent(ContainerDetailsComponent);

	}

	@Action(EventActions.OpenDetails)
	public async openDetails(ctx: StateContext<IEventState>, {payload: item}: EventActions.OpenDetails) {

		const title = this.translateService.instant('event.details.title');

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: ContainerDetailsComponent,
			componentInputs: {
				event: item
			},
		});

	}

	// @Action(EventActions.OpenDetailsById)
	// public async openDetailsById(ctx: StateContext<IEventState>, {payload: id}: EventActions.OpenDetailsById) {
	//
	// 	const title = this.translateService.instant('event.details.title');
	//
	// 	const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");
	//
	// 	await this.whacAMaleProvider.buildItAsync({
	// 		component: ContainerDetailsComponent,
	// 		showLoading: true,
	// 		title
	// 	});
	//
	// 	const event = await this.item.executeAsync(id);
	//
	// 	await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
	// 		id,
	// 		component: ContainerDetailsComponent,
	// 		componentInputs: {
	// 			event: Event.MEvent.create(event)
	// 		},
	// 	});
	//
	// }

	@Action(EventActions.ChangeServiceStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: EventActions.ChangeServiceStatus): Promise<void> {
		const foundItem = await this.orderService.repository.findByIdAsync(action.payload.orderId);

		if (!foundItem) {
			return;
		}

		const modifiedItem = {
			...foundItem,
			services: foundItem.services.map((service) => {
				if (service._id === action.payload.serviceId) {
					return {
						...service,
						status: action.payload.status,
					};
				}
				return service;
			})
		};

		const entity = EOrder.create(modifiedItem);

		await this.orderService.repository.updateAsync(entity);
	}

}
