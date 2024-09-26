import {Component, HostBinding, inject, Input, OnInit} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {IEvent_V2} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@event/presentation/component/details/v2.general.details.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {V2ButtonsDetailsComponent} from "@event/presentation/component/details/v2.buttons.details.component";
import {
	ButtonOpenOrderDetailsComponent
} from "@event/presentation/component/details/button.open-order.details.component";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {OrderActions} from "@order/state/order/order.actions";
import {Reactive} from "@utility/cdk/reactive";
import {EventActions} from "@event/state/event/event.actions";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	imports: [
		AsyncPipe,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		NgIf,
		LoaderComponent,
		V2GeneralDetailsComponent,
		V2ButtonsDetailsComponent,
		ButtonOpenOrderDetailsComponent
	],
	template: `
		<ng-container *ngIf="event; else LoadingTemplate">

			<button-open-order-details [order]="event.originalData.order"/>
			<event-v2-general-details [event]="event"/>
			<app-event-v2-buttons-details [event]="event"/>
			<event-meta-details
				[orderDro]="event.originalData.order"
				[orderServiceDto]="event.originalData.service"/>

		</ng-container>

		<ng-template #LoadingTemplate>
			<utility-loader/>
		</ng-template>
	`
})
export class ContainerDetailsComponent extends Reactive implements OnInit {

	@Input({required: true})
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@HostBinding()
	public class = 'pb-48 block';

	private readonly store = inject(Store);
	private readonly actions$ = inject(Actions);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnInit(): void {

		this.actions$
			.pipe(
				this.takeUntil(),
				ofActionSuccessful(
					OrderActions.DeleteItem,
				)
			)
			.subscribe(({payload: orderId}) => {

				if (this.event.originalData.order._id !== orderId) {
					return;
				}

				this.ngxLogger.debug('ContainerDetailsComponent.ngOnInit', `Order ${orderId} deleted, closing dialog`);

				// Close the dialog
				this.store.dispatch(new EventActions.CloseDetails());
			});

	}

}
