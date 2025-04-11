import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@tenant/event/infrastructure/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
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

	private readonly sharedUow = inject(SharedUow);

	// Change status
	private readonly translateService = inject(TranslateService);
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
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new EventActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['event', payload._id]}}]);

	}

}
