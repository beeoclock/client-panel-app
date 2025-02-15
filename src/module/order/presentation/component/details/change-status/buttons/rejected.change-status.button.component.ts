import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from "@angular/core";
import {
	BaseChangeStatusButtonComponent
} from "@order/presentation/component/details/change-status/base.change-status.button.component";
import {TranslateModule} from "@ngx-translate/core";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {OrderStatusEnum} from "@src/core/business-logic/order/enum/order.status.enum";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-rejected-change-status-button',
	imports: [
		TranslateModule
	],
	template: `
		{{ 'order.enum.status.singular.rejected' | translate }}
	`
})
export class RejectedChangeStatusButtonComponent extends BaseChangeStatusButtonComponent implements OnInit {

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
				status: OrderStatusEnum.rejected
			})
		)
	}

}
