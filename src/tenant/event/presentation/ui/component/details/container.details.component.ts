import {ChangeDetectionStrategy, Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {MetaDetailsComponent} from "@tenant/event/presentation/ui/component/details/meta.details.component";
import {IEvent_V2} from "@tenant/event/domain";
import {LoaderComponent} from "@shared/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@tenant/event/presentation/ui/component/details/v2.general.details.component";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {
	ButtonOpenOrderDetailsComponent
} from "@tenant/event/presentation/ui/component/details/button.open-order.details.component";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {Reactive} from "@core/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";

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
		@if (item(); as item) {
			<!--			<div class="p-2">-->
			<!--				<app-event-status-segment-component [event]="event"/>-->
			<!--			</div>-->
			<app-list-service-form-card-order-component
				[idPrefix]="item.originalData.service._id"
				[order]="item.originalData.order"
				[specificOrderServiceId]="item.originalData.service._id"/>

			<event-v2-general-details [event]="item"/>
			<!--			<app-event-v2-buttons-details [event]="event"/>-->
			<button-open-order-details [order]="item.originalData.order"/>
			<event-meta-details
				[orderDro]="item.originalData.order"
				[orderServiceDto]="item.originalData.service"/>
		} @else {
			<utility-loader/>
		}
	`,
	host: {
		class: 'pb-48 block'
	}
})
export class ContainerDetailsComponent extends Reactive implements OnInit {

	public readonly item = input.required<IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; }>>();

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

				if (this.item().originalData.order._id !== order._id) {
					return;
				}
			});

		// this.actions$
		// 	.pipe(
		// 		this.takeUntil(),
		// 		ofActionSuccessful(
		// 			OrderActions.,
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

export default ContainerDetailsComponent;
