import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {AsyncPipe} from "@angular/common";
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
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {
	ListServiceFormCardOrderComponent
} from "@order/presentation/component/list/card/item/services/list.service.form.card.order.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		LoaderComponent,
		V2GeneralDetailsComponent,
		V2ButtonsDetailsComponent,
		ButtonOpenOrderDetailsComponent,
		ItemV2ListServiceFormOrderComponent,
		ListServiceFormCardOrderComponent
	],
	template: `
		@if (event) {
			<button-open-order-details [order]="event.originalData.order"/>

			<app-list-service-form-card-order-component
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
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@HostBinding()
	public class = 'pb-48 block';

	private readonly store = inject(Store);
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

				this.refreshCalendarWithSpecialist();

			});

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

	@Dispatch()
	public async refreshCalendarWithSpecialist() {
		return new CalendarWithSpecialistsAction.GetItems();
	}

}
