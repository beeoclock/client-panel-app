import {ChangeDetectionStrategy, Component, inject, model, ViewEncapsulation} from "@angular/core";
import {MetaDetailsComponent} from "@tenant/event/presentation/ui/component/details/meta.details.component";
import {IEvent_V2} from "@tenant/event/domain";
import {LoaderComponent} from "@shared/presentation/ui/component/loader/loader.component";
import {AttendeesDetailsComponent} from "@tenant/event/presentation/ui/component/details/attendees.details.component";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {
	ButtonOpenOrderDetailsComponent
} from "@tenant/event/presentation/ui/component/details/button.open-order.details.component";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {tap} from "rxjs/operators";
import {TranslatePipe} from "@ngx-translate/core";
import {CurrencyPipe} from "@angular/common";
import EOrder from "@tenant/order/order/domain/entity/e.order";


@Component({
	selector: 'event-container-details-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		MetaDetailsComponent,
		LoaderComponent,
		AttendeesDetailsComponent,
		ButtonOpenOrderDetailsComponent,
		ListServiceFormCardOrderComponent,
		TranslatePipe,
		CurrencyPipe,
	],
	template: `
		@if (item(); as item) {
			<!--			<div class="p-2">-->
			<!--				<app-event-status-segment-component [event]="event"/>-->
			<!--			</div>-->
			<app-list-service-form-card-order-component
				class="m-2"
				[idPrefix]="item.originalData.service._id"
				[order]="item.originalData.order"
				[specificOrderServiceId]="item.originalData.service._id"/>

			<attendees-general-details [event]="item"/>
			<!--			<app-event-v2-buttons-details [event]="event"/>-->
			<div class="p-2">
				<button-open-order-details
					[order]="item.originalData.order"/>
			</div>
			<event-meta-details
				[orderDro]="item.originalData.order"
				[orderServiceDto]="item.originalData.service"/>

			<div class="absolute bottom-0 w-full p-2 bg-white border-t">
				<button (click)="checkout()" class="w-full rounded-xl justify-center items-center bg-blue-600 text-white flex gap-2 py-3 border border-gray-200 hover:bg-blue-800">
					{{ item.originalData.service.serviceSnapshot.durationVersions[0].prices[0].price | currency: item.originalData.service.serviceSnapshot.durationVersions[0].prices[0].currency: 'symbol': '1.0-0' }}
					•
					{{ 'event.details.button.checkout.label' | translate }}
				</button>
			</div>
		} @else {
			<utility-loader/>
		}
	`,
	host: {
		class: 'pb-48 block'
	}
})
export class ContainerDetailsComponent {

	public readonly item = model.required<IEvent_V2<{ order: IOrder.DTO; service: IOrderService.DTO; }>>();

	private readonly store = inject(Store);
	private readonly actions = inject(Actions);

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			OrderActions.SetOrderedService,
			OrderActions.OrderedServiceState,
			OrderActions.OrderedServiceStatus,
			OrderActions.UpdateItem,
			OrderActions.ChangeStatus,
			OrderActions.SetState,
		),
		tap((action) => {
			if (action instanceof OrderActions.UpdateItem) {
				const {payload} = action;
				const entity = EOrder.fromRaw(payload);
				const item = this.item();
				const conditionIdEntityAndIdOrderNotTheSame = item.originalData.order._id !== entity._id;
				console.log('OrderActions.UpdateItem', {entity, item, conditionIdEntityAndIdOrderNotTheSame});
				if (conditionIdEntityAndIdOrderNotTheSame) return;
				this.item.set({
					...item,
					originalData: {
						order: entity.toDTO(),
						service: entity.services.find(({_id}) => _id === item.originalData.service._id) ?? item.originalData.service,
					},
				});
			}
			if (action instanceof OrderActions.SetOrderedService) {
				const {payload: {entity}} = action;
				const item = this.item();
				const conditionIdEntityAndIdServiceNotTheSame = item.originalData.service._id !== entity._id;
				console.log('OrderActions.SetOrderedService', {entity, item, conditionIdEntityAndIdServiceNotTheSame});
				if (conditionIdEntityAndIdServiceNotTheSame) return;
				const service= entity.toDTO();
				this.item.set({
					...item,
					originalData: {
						order: {
							...item.originalData.order,
							services: item.originalData.order.services.map(os => os._id === service._id ? service : os)
						},
						service,
					},
				})
			}
		})
	).subscribe();

	public checkout() {
		const action = new OrderActions.Checkout({
			orderId: this.item().originalData.order._id,
			selected: {
				serviceIdList: [this.item().originalData.service._id],
			}
		});
		this.store.dispatch(action);
	}

}

export default ContainerDetailsComponent;
