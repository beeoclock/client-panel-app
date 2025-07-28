import {ChangeDetectionStrategy, Component, input, output, viewChild, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";
import {FormControl} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {
	StatusOrderIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.order.icon.component";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-order-status-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		IonItem,
		IonLabel,
		IonList,
		TranslatePipe,
		StatusOrderIconComponent,
		AsyncPipe,
	],
	template: `
		<button
			[id]="'select-order-service-status-version-' + id()"
			[class.w-9]="!showLabel()"
			[class.px-2]="showLabel()"
			class="h-9 border border-gray-200 justify-center items-center flex bg-white rounded-lg hover:bg-neutral-300 hover:border-neutral-400">
			<div class="text-center text-black text-sm font-bold uppercase flex items-center gap-2">
				<app-status-order-icon-component
					class="flex text-3xl"
					[status]="control().valueChanges | async"/>
				@if (showLabel()) {
					<span>{{ ('order.enum.status.singular.'+ control().getRawValue()) | translate }}</span>
				}
				<i class="bi bi-chevron-expand"></i>
			</div>
		</button>
		<ion-popover [trigger]="'select-order-service-status-version-' + id()">
			<ng-template>
				<ion-list>

					@for (status of orderStatusList; track status) {
						@if (status !== control().getRawValue()) {
							<ion-item [button]="true" lines="full" [detail]="false" (click)="select(status)">
								<ion-label class="!flex items-center gap-2">
									<app-status-order-icon-component class="flex text-3xl" [status]="status"/>
									{{ 'order.enum.status.singular.' + status | translate }}
								</ion-label>
							</ion-item>
						}
					}

				</ion-list>
			</ng-template>
		</ion-popover>
    `
})
export class OrderStatusChipComponent {

	public readonly showLabel = input<boolean>(false);

	public readonly control = input.required<FormControl<OrderStatusEnum>>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly statusChanges = output<OrderStatusEnum>();

	public readonly selectOrderServiceStatusPopover = viewChild.required(IonPopover);

	public readonly orderStatusList = [
		// OrderStatusEnum.draft,
		// OrderStatusEnum.deleted,
		OrderStatusEnum.requested,
		OrderStatusEnum.confirmed,
		OrderStatusEnum.inProgress,
		OrderStatusEnum.done,
		OrderStatusEnum.cancelled,
		OrderStatusEnum.rejected,
		// OrderStatusEnum.waitingForPayment,
	];

	public select(status: OrderStatusEnum) {
		if (this.control().value !== status) {
			this.selectOrderServiceStatusPopover().dismiss().then();
			this.control().setValue(status);
			this.statusChanges.emit(status);
		}
	}

}

