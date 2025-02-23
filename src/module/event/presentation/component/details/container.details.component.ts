import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {IEvent_V2} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@event/presentation/component/details/v2.general.details.component";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {IOrderServiceDto} from "@src/core/business-logic/order/interface/i.order-service.dto";
import {V2ButtonsDetailsComponent} from "@event/presentation/component/details/v2.buttons.details.component";
import {
	ButtonOpenOrderDetailsComponent
} from "@event/presentation/component/details/button.open-order.details.component";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {Reactive} from "@utility/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
	ListServiceFormCardOrderComponent
} from "@order/presentation/component/list/card/item/services/list.service.form.card.order.component";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		MetaDetailsComponent,
		LoaderComponent,
		V2GeneralDetailsComponent,
		V2ButtonsDetailsComponent,
		ButtonOpenOrderDetailsComponent,
		ListServiceFormCardOrderComponent
	],
	template: `
		@if (event) {
			<button-open-order-details [order]="event.originalData.order"/>

			<app-list-service-form-card-order-component
				[idPrefix]="event.originalData.service._id"
				[order]="event.originalData.order"
				[specificOrderServiceId]="event.originalData.service._id"/>

			<event-v2-general-details [event]="event"/>
			<app-event-v2-buttons-details [event]="event"/>
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
