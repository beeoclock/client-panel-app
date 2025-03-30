import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {MetaDetailsComponent} from "@tenant/event/presentation/ui/component/details/meta.details.component";
import {IEvent_V2} from "@tenant/event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@tenant/event/presentation/ui/component/details/v2.general.details.component";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/domain/interface/i.order-service.dto";
import {
	ButtonOpenOrderDetailsComponent
} from "@tenant/event/presentation/ui/component/details/button.open-order.details.component";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {OrderActions} from "@tenant/order/presentation/state/order/order.actions";
import {Reactive} from "@utility/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		MetaDetailsComponent,
		LoaderComponent,
		V2GeneralDetailsComponent,
		ButtonOpenOrderDetailsComponent,
		ListServiceFormCardOrderComponent,
	],
	template: `
		@if (event) {
<!--			<div class="p-2">-->
<!--				<app-event-status-segment-component [event]="event"/>-->
<!--			</div>-->
			<app-list-service-form-card-order-component
				[idPrefix]="event.originalData.service._id"
				[order]="event.originalData.order"
				[specificOrderServiceId]="event.originalData.service._id"/>

			<event-v2-general-details [event]="event"/>
			<!--			<app-event-v2-buttons-details [event]="event"/>-->
			<button-open-order-details [order]="event.originalData.order"/>
			<event-meta-details
				[orderDro]="event.originalData.order"
				[orderServiceDto]="event.originalData.service"/>
		} @else {
			<utility-loader/>
		}
	`
})
export class ContainerDetailsComponent extends Reactive implements OnInit {

	@Input({required: true})
	public event!: IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; }>;

	@HostBinding()
	public class = 'pb-48 block';

	private readonly actions$ = inject(Actions);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnInit(): void {

		this.ngxLogger.log('ContainerDetailsComponent:ngOnInit');

		this.actions$
			.pipe(
				this.takeUntil(),
				ofActionSuccessful(
					OrderActions.UpdateItem,
				)
			)
			.subscribe(({payload: order}) => {

				if (this.event.originalData.order._id !== order._id) {
					return;
				}
			});

		// this.actions$
		// 	.pipe(
		// 		this.takeUntil(),
		// 		ofActionSuccessful(
		// 			OrderActions.DeleteItem,
		// 		)
		// 	)
		// 	.subscribe(({payload: orderId}) => {
		//
		// 		if (this.event.originalData.order._id !== orderId) {
		// 			return;
		// 		}
		//
		// 		this.ngxLogger.debug('ContainerDetailsComponent.ngOnInit', `Order ${orderId} deleted, closing dialog`);
		//
		// 		// Close the dialog
		// 		this.store.dispatch(new EventActions.CloseDetails());
		// 	});

	}

}
