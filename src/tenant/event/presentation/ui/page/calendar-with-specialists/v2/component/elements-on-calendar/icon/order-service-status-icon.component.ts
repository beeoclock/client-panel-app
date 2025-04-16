import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {IconComponent} from "@shared/presentation/component/adapter/icon/icon.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	standalone: true,
	selector: 'app-order-service-status-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span [class]="iconClass()">
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
		</span>
		@if (showLabel()) {
			<span [class]="labelCLass()">{{ ('event.keyword.status.singular.' + status()) | translate }}</span>
		}
	`,
	imports: [
		IconComponent,
		TranslatePipe
	]
})
export class OrderServiceStatusIconComponent {

	public readonly iconClass = input<string>();

	public readonly labelCLass = input<string>();

	public readonly showLabel = input<boolean>(false);

	public readonly status = input.required<OrderServiceStatusEnum>();

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;

}
