import {ChangeDetectionStrategy, Component, input, output, viewChild, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";
import {NgClass} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {
	StatusOrderIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.order.icon.component";

@Component({
	selector: 'app-status-order-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		IonItem,
		IonLabel,
		IonList,
		NgClass,
		TranslatePipe,
		StatusOrderIconComponent,
	],
	template: `
		<button
			[id]="'select-order-service-status-version-' + id()"
			class="h-9 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-center flex items-center pe-2 text-black text-sm font-bold uppercase">
				<app-status-order-icon-component
					class="flex text-3xl"
					[ngClass]="{
						'text-red-600': initialValue() === orderStatusEnum.cancelled,
						'text-blue-600': initialValue() === orderStatusEnum.confirmed,
						'text-green-600': initialValue() === orderStatusEnum.done,
					}"
					[status]="initialValue()"/>
				@if (showLabel()) {
					{{ ('order.enum.status.singular.' + initialValue()) | translate }}
				}
			</div>
		</button>
		<ion-popover [trigger]="'select-order-service-status-version-' + id()">
			<ng-template>
				<ion-list>

					<!-- Accepted -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderStatusEnum.confirmed)">
						<ion-label class="!flex items-center gap-2">
							<app-status-order-icon-component
								class="flex text-3xl text-blue-600"
								[status]="orderStatusEnum.confirmed"/>
							{{ 'event.keyword.status.singular.accepted' | translate }}
						</ion-label>
					</ion-item>

					<!-- Done -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderStatusEnum.done)">
						<ion-label class="!flex items-center gap-2">
							<app-status-order-icon-component
								class="flex text-3xl text-green-600"
								[status]="orderStatusEnum.done"/>
							{{ 'event.keyword.status.singular.done' | translate }}
						</ion-label>
					</ion-item>

					<!-- Cancelled -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderStatusEnum.cancelled)">
						<ion-label class="!flex items-center gap-2">
							<app-status-order-icon-component
								class="flex text-3xl text-red-600"
								[status]="orderStatusEnum.cancelled"/>
							{{ 'event.keyword.status.singular.cancelled' | translate }}
						</ion-label>
					</ion-item>
				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class StatusOrderChipComponent {

	public readonly showLabel = input<boolean>(false);

	public readonly initialValue = input.required<OrderStatusEnum>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly statusChanges = output<OrderStatusEnum>();

	public readonly selectOrderStatusPopover = viewChild.required(IonPopover);

	public readonly orderStatusEnum = OrderStatusEnum;

	public select(status: OrderStatusEnum) {
		if (this.initialValue() !== status) {
			this.selectOrderStatusPopover().dismiss().then();
			this.statusChanges.emit(status);
		}
	}

}

export default StatusOrderChipComponent;
