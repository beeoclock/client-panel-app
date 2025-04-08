import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from "@angular/core";
import {
	BaseChangeStatusButtonComponent
} from "@tenant/order/order/presentation/ui/component/details/change-status/base.change-status.button.component";
import {TranslateModule} from "@ngx-translate/core";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-done-change-status-button',
	imports: [
		TranslateModule
	],
	template: `
		{{ 'order.enum.status.singular.done' | translate }}
	`
})
export class DoneChangeStatusButtonComponent extends BaseChangeStatusButtonComponent implements OnInit {

	public ngOnInit(): void {
		this.class += 'text-green-500';
	}

	public async changeStatus() {
		const answer = await this.confirm();
		if (!answer) {
			return;
		}
		this.store.dispatch(
			new OrderActions.ChangeStatus({
				item: this.item(),
				status: OrderStatusEnum.done
			})
		)
	}

}
