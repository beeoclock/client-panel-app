import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {IconComponent} from "@shared/presentation/ui/component/adapter/icon/icon.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	standalone: true,
	selector: 'app-order-service-status-icon-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@switch (status()) {
			@case (orderServiceStatusEnum.done) {
				<app-icon [class]="iconClass()" title="Done" name="bootstrapCheck2All"/>
			}
			@case (orderServiceStatusEnum.cancelled) {
				<app-icon [class]="iconClass()" title="Cancelled" name="bootstrapX"/>
			}
			@case (orderServiceStatusEnum.rejected) {
				<app-icon [class]="iconClass()" title="Rejected" name="bootstrapX"/>
			}
			@case (orderServiceStatusEnum.accepted) {
				<app-icon [class]="iconClass()" title="Accepted" name="bootstrapCheck2"/>
			}
			@case (orderServiceStatusEnum.inProgress) {
				<app-icon [class]="iconClass()" title="In progress" name="bootstrapHourglassSplit"/>
			}
			@case (orderServiceStatusEnum.requested) {
				<app-icon [class]="iconClass()" title="Requested" name="bootstrapExclamation"/>
			}
			@case (orderServiceStatusEnum.deleted) {
				<app-icon [class]="iconClass()" title="Requested" name="bootstrapArchive"/>
			}
		}
		@if (showLabel()) {
			<span [class]="labelCLass()">{{ ('event.keyword.status.singular.' + translatedStatusKey) | translate }}</span>
		}
	`,
	imports: [
		IconComponent,
		TranslatePipe
	],
	host: {
		'[class.text-red-600]': 'useDefaultStyle() && status() === orderServiceStatusEnum.cancelled',
		'[class.text-red-700]': 'useDefaultStyle() && status() === orderServiceStatusEnum.deleted',
		'[class.text-red-800]': 'useDefaultStyle() && status() === orderServiceStatusEnum.rejected',
		'[class.text-neutral-600]': 'useDefaultStyle() && status() === orderServiceStatusEnum.accepted',
		'[class.text-blue-600]': 'useDefaultStyle() && status() === orderServiceStatusEnum.requested',
		'[class.text-green-600]': 'useDefaultStyle() && status() === orderServiceStatusEnum.done',
		'[class.text-yellow-600]': 'useDefaultStyle() && status() === orderServiceStatusEnum.inProgress',
	}
})
export class OrderServiceStatusIconComponent {

	public readonly iconClass = input<string>();

	public readonly labelCLass = input<string>();

	public readonly showLabel = input<boolean>(false);

	public readonly useDefaultStyle = input<boolean>(true);

	public readonly status = input.required<OrderServiceStatusEnum>();

	public get translatedStatusKey(): string {
		return this.statusKeyMap[this.status()] ?? this.status();
	}

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;

	private readonly statusKeyMap: Partial<Record<OrderServiceStatusEnum, string>> = {
		[OrderServiceStatusEnum.accepted]: 'confirmed',
	};

}
