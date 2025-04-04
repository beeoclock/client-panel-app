import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from "@angular/core";
import {
	BaseChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/base.change-status.button.component";
import {TranslateModule} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import {OrderStatusEnum} from "@tenant/order/domain/enum/order.status.enum";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-cancelled-change-status-button',
	imports: [
		TranslateModule
	],
	template: `
		{{ 'order.enum.status.singular.cancelled' | translate }}
	`
})
export class CancelledChangeStatusButtonComponent extends BaseChangeStatusButtonComponent implements OnInit {

	public ngOnInit(): void {
		this.class += 'text-red-500';
	}

	public async changeStatus() {
		const answer = await this.confirm();
		if (!answer) {
			return;
		}
		this.store.dispatch(
			new OrderActions.ChangeStatus({
				id: this.item()._id,
				status: OrderStatusEnum.cancelled
			})
		)
	}

}
