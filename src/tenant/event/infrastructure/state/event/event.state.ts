import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@tenant/event/infrastructure/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {SharedUow} from "@core/shared/uow/shared.uow";
import CustomerDetailsContainerComponent
	from "@tenant/customer/presentation/ui/component/details/customer-details-container.component";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";


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

		// const title = this.translateService.instant('event.details.title');
		//
		// const {ContainerDetailsComponent} = await import("@tenant/event/presentation/ui/component/details/container.details.component");
		//
		// await this.whacAMaleProvider.buildItAsync({
		// 	title,
		// 	component: ContainerDetailsComponent,
		// 	componentInputs: {
		// 		event: item
		// 	},
		// });


		const activated = this.secondRouterOutletService.activated();

		if (activated) {
			if (activated instanceof CustomerDetailsContainerComponent) {
				const {_id} = activated.item() ?? {};
				if (_id === payload._id) {
					const action = new CustomerPresentationActions.CloseDetails();
					ctx.dispatch(action);
					return;
				}
			}
		}

		await this.router.navigate([{outlets: {second: ['event', payload._id]}}]);

	}

}
