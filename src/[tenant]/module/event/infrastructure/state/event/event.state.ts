import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@event/infrastructure/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {IOrderState} from "@order/infrastructure/state/order/order.state";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import EOrder from "@core/business-logic/order/entity/e.order";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {SharedUow} from "@core/shared/uow/shared.uow";


export interface IEventState {

}

@State<IEventState>({
	name: 'event',
	defaults: {},
})
@Injectable()
export class EventState {

	private readonly sharedUow = inject(SharedUow);

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

	@Action(EventActions.ChangeServiceStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: EventActions.ChangeServiceStatus): Promise<void> {
		const foundItem = await this.sharedUow.order.repository.findByIdAsync(action.payload.orderId);

		if (!foundItem) {
			return;
		}

		// TODO: Check if all orderService will have the same status, e.g. canceled then change status of order on canceled

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

		const entity = EOrder.fromDTO(modifiedItem);
		ctx.dispatch(new OrderActions.UpdateItem(entity));
	}

}
