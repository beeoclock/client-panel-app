import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {IOrderState} from "@order/state/order/order.state";
import {
	PatchStatusServiceOrderApiAdapter
} from "@order/external/adapter/api/status/patch.status.service.order.api.adapter";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";


export interface IEventState {

}

@State<IEventState>({
	name: 'event',
	defaults: {},
})
@Injectable()
export class EventState {

	private readonly patchStatusServiceOrderApiAdapter = inject(PatchStatusServiceOrderApiAdapter);

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
		await this.patchStatusServiceOrderApiAdapter.executeAsync(
			action.payload.orderId,
			action.payload.serviceId,
			action.payload.status
		);

	}

}
