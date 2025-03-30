import {ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {
	CancelledChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/buttons/cancelled.change-status.button.component";
import {
	ConfirmedChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/buttons/confirmed.change-status.button.component";
import {
	DoneChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/buttons/done.change-status.button.component";
import {
	RejectedChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/buttons/rejected.change-status.button.component";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'app-container-change-status-button',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CancelledChangeStatusButtonComponent,
		ConfirmedChangeStatusButtonComponent,
		DoneChangeStatusButtonComponent,
		RejectedChangeStatusButtonComponent,
		NgSwitch,
		NgSwitchCase,
		TranslateModule
	],
	template: `

		<div class="flex flex-col gap-2 mb-4">
			<div class="text-xl text-gray-600">
				{{ 'keyword.capitalize.changeStatus' | translate }}
			</div>
			<div class="text-sm text-gray-500">
				{{ 'order.confirmation.change-status.hint' | translate }}
			</div>
		</div>
		<div class="flex flex-col gap-4" [ngSwitch]="item().status">

			<ng-container *ngSwitchCase="status.inProgress">
				<app-cancelled-change-status-button [item]="item()"/>
				<app-done-change-status-button [item]="item()"/>
			</ng-container>
			<ng-container *ngSwitchCase="status.done">

			</ng-container>
			<ng-container *ngSwitchCase="status.confirmed">
				<app-cancelled-change-status-button [item]="item()"/>
				<app-done-change-status-button [item]="item()"/>
			</ng-container>
			<ng-container *ngSwitchCase="status.cancelled">
<!--				<app-confirmed-change-status-button [item]="item"/>-->
			</ng-container>
			<ng-container *ngSwitchCase="status.rejected">
<!--				<app-confirmed-change-status-button [item]="item"/>-->
			</ng-container>
			<ng-container *ngSwitchCase="status.draft">

			</ng-container>
			<ng-container *ngSwitchCase="status.requested">
				<app-confirmed-change-status-button [item]="item()"/>
				<app-rejected-change-status-button [item]="item()"/>
			</ng-container>

		</div>

<!--		<app-draft-change-status-button [item]="item"/>-->
<!--		<app-requested-change-status-button [item]="item"/>-->


<!--		<app-pending-change-status-button [item]="item"/>-->
	`
})
export class ContainerChangeStatusButtonComponent extends Reactive {

	public readonly item = input.required<IOrder.DTO>();

	public readonly status = OrderStatusEnum;

	@HostBinding()
	public class = 'w-full';

}
