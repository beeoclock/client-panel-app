import {ChangeDetectionStrategy, Component, input, output, viewChild, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {FormControl} from "@angular/forms";
import {
	StatusIconComponent
} from "@page/event/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.icon.component";
import {NgClass} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	selector: 'app-status-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		IonItem,
		IonLabel,
		IonList,
		StatusIconComponent,
		NgClass,
		TranslatePipe,
	],
	template: `
		<button
			[id]="'select-order-service-status-version-' + id()"
			class="w-9 h-9 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-center text-black text-sm font-bold uppercase">
				<app-status-icon-component
					class="flex text-3xl"
					[ngClass]="{
						'text-red-600': control().value === orderServiceStatusEnum.cancelled,
						'text-blue-600': control().value === orderServiceStatusEnum.accepted,
						'text-green-600': control().value === orderServiceStatusEnum.done,
					}"
					[status]="control().value"/>
				@if (showLabel()) {
					{{ ('event.keyword.status.singular.' + control().value) | translate }}
				}
			</div>
		</button>
		<ion-popover [trigger]="'select-order-service-status-version-' + id()">
			<ng-template>
				<ion-list>

					<!-- Accepted -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderServiceStatusEnum.accepted)">
						<ion-label class="!flex items-center gap-2">
							<app-status-icon-component
								class="flex text-3xl text-blue-600"
								[status]="orderServiceStatusEnum.accepted"/>
							{{ 'event.keyword.status.singular.accepted' | translate }}
						</ion-label>
					</ion-item>

					<!-- Done -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderServiceStatusEnum.done)">
						<ion-label class="!flex items-center gap-2">
							<app-status-icon-component
								class="flex text-3xl text-green-600"
								[status]="orderServiceStatusEnum.done"/>
							{{ 'event.keyword.status.singular.done' | translate }}
						</ion-label>
					</ion-item>

					<!-- Cancelled -->
					<ion-item [button]="true" lines="full" [detail]="false"
							  (click)="select(orderServiceStatusEnum.cancelled)">
						<ion-label class="!flex items-center gap-2">
							<app-status-icon-component
								class="flex text-3xl text-red-600"
								[status]="orderServiceStatusEnum.cancelled"/>
							{{ 'event.keyword.status.singular.cancelled' | translate }}
						</ion-label>
					</ion-item>
				</ion-list>
			</ng-template>
		</ion-popover>
    `
})
export class StatusChipComponent {

	public readonly showLabel = input<boolean>(false);

	public readonly control = input.required<FormControl<OrderServiceStatusEnum>>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly statusChanges = output<OrderServiceStatusEnum>();

	public readonly selectOrderServiceStatusPopover = viewChild.required(IonPopover);

	public readonly orderServiceStatusEnum = OrderServiceStatusEnum;

	public select(status: OrderServiceStatusEnum) {
		if (this.control().value !== status) {
			this.selectOrderServiceStatusPopover().dismiss().then();
			this.control().setValue(status);
			this.statusChanges.emit(status);
		}
	}

}

export default StatusChipComponent;
