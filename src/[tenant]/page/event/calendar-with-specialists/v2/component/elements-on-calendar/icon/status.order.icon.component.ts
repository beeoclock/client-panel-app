import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";

@Component({
	standalone: true,
	selector: 'app-status-order-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@switch (status()) {
			@case (orderStatusEnum.done) {
				<app-icon title="Done" name="bootstrapCheck2All"/>
			}
			@case (orderStatusEnum.cancelled) {
				<app-icon title="Cancelled" name="bootstrapX"/>
			}
			@case (orderStatusEnum.rejected) {
				<app-icon title="Rejected" name="bootstrapX"/>
			}
			@case (orderStatusEnum.confirmed) {
				<app-icon title="confirmed" name="bootstrapCheck2"/>
			}
			@case (orderStatusEnum.inProgress) {
				<app-icon title="In progress" name="bootstrapHourglassSplit"/>
			}
			@case (orderStatusEnum.requested) {
				<app-icon title="Requested" name="bootstrapExclamation"/>
			}
			@case (orderStatusEnum.deleted) {
				<app-icon title="Requested" name="bootstrapArchive"/>
			}
		}
	`,
	imports: [
		IconComponent
	]
})
export class StatusOrderIconComponent {

	public readonly status = input.required<OrderStatusEnum>();

	protected readonly orderStatusEnum = OrderStatusEnum;

}
