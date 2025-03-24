import {Component, effect, input} from "@angular/core";
import {IonLabel, IonSegment, IonSegmentButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {IEvent_V2} from "@event/domain";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {IOrderServiceDto} from "@core/business-logic/order/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, tap} from "rxjs";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderActions} from "@order/presentation/state/order/order.actions";
import {is} from "@core/shared/checker";

@Component({
	selector: 'app-event-status-segment-component',
	standalone: true,
	imports: [
		IonLabel,
		IonSegment,
		IonSegmentButton,
		TranslatePipe,
		ReactiveFormsModule
	],
	template: `

		<ion-segment [formControl]="orderServiceStatusControl">
			<ion-segment-button [value]="orderServiceStatusEnum.accepted">
				<ion-label>
					{{ 'event.keyword.status.singular.accepted' | translate }}
				</ion-label>
			</ion-segment-button>
			<ion-segment-button [value]="orderServiceStatusEnum.done">
				<ion-label>
					{{ 'event.keyword.status.singular.done' | translate }}
				</ion-label>
			</ion-segment-button>
			<ion-segment-button [value]="orderServiceStatusEnum.cancelled">
				<ion-label>
					{{ 'event.keyword.status.singular.cancelled' | translate }}
				</ion-label>
			</ion-segment-button>
		</ion-segment>

	`,
	host: {
		class: ''
	}
})
export class StatusSegmentComponent {

	public readonly event = input.required<IEvent_V2<{
		order: IOrder.DTO;
		service: IOrderServiceDto;
	}>>();

	public readonly orderServiceStatusControl = new FormControl<OrderServiceStatusEnum>(OrderServiceStatusEnum.accepted);

	public constructor() {
		effect(() => {
			this.orderServiceStatusControl.setValue(this.event().originalData.service.status);
		});
	}

	private readonly valueSubscription = this.orderServiceStatusControl.valueChanges.pipe(
		takeUntilDestroyed(),
		filter(is.not_null_or_undefined<OrderServiceStatusEnum>),
		tap((status) => {
			this.setOrderServiceStatus(status);
		})
	).subscribe();

	@Dispatch()
	public setOrderServiceStatus(status: OrderServiceStatusEnum) {
		return new OrderActions.OrderedServiceStatus(
			this.event().originalData.order._id,
			this.event().originalData.service._id,
			status,
		)
	}

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;
}
