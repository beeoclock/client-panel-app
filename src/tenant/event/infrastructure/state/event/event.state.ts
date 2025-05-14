import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@tenant/event/infrastructure/state/event/event.actions";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import ContainerDetailsComponent from "@tenant/event/presentation/ui/component/details/container.details.component";


export interface IEventState {

}

@State<IEventState>({
	name: 'event',
	defaults: {},
})
@Injectable()
export class EventState {

	// Change status
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);


	@Action(EventActions.CloseDetails)
	public async closeDetails(ctx: StateContext<IEventState>, action?: EventActions.CloseDetails) {
		await this.router.navigate([{outlets: {second: null}}]);
	}

	@Action(EventActions.OpenDetails)
	public async openDetails(ctx: StateContext<IEventState>, {payload}: EventActions.OpenDetails) {


		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof ContainerDetailsComponent) {
				const {originalData: {service: {_id}}} = activated.item() ?? {};
				if (_id === payload) {
					const action = new EventActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['event', payload]}}]);

	}

}
