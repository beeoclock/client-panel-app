import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {OrderServiceStatusEnum} from "@tenant/order/domain/enum/order-service.status.enum";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	standalone: true,
	selector: 'app-order-service-status-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@switch (status()) {
			@case (orderServiceStatusEnum.done) {
				<app-icon title="Done" name="bootstrapCheck2All"/>
			}
			@case (orderServiceStatusEnum.cancelled) {
				<app-icon title="Cancelled" name="bootstrapX"/>
			}
			@case (orderServiceStatusEnum.rejected) {
				<app-icon title="Rejected" name="bootstrapX"/>
			}
			@case (orderServiceStatusEnum.accepted) {
				<app-icon title="Accepted" name="bootstrapCheck2"/>
			}
			@case (orderServiceStatusEnum.inProgress) {
				<app-icon title="In progress" name="bootstrapHourglassSplit"/>
			}
			@case (orderServiceStatusEnum.requested) {
				<app-icon title="Requested" name="bootstrapExclamation"/>
			}
			@case (orderServiceStatusEnum.deleted) {
				<app-icon title="Requested" name="bootstrapArchive"/>
			}
		}
	`,
	imports: [
		IconComponent
	]
})
export class OrderServiceStatusIconComponent {

	public readonly status = input.required<OrderServiceStatusEnum>();

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;

}
