import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {StateEnum} from "@core/shared/enum/state.enum";

@Component({
	selector: 'app-order-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!--
					(activate)="activate()"
					(deactivate)="deactivate()"-->
		<utility-table-column-action
			[hide]="['deactivate', 'activate']"
			(open)="open()"
			(edit)="edit()"
			(delete)="delete()"
			(deactivate)="deactivate()"
			(activate)="activate()"
			[id]="id()"/>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
	]
})
export class RowActionButtonComponent {

	public readonly id = input.required<string>();

	public readonly item = input.required<IOrder.DTO>();

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	public readonly returnUrl = this.router.url;

	public delete(): void {

		const question = this.translateService.instant('order.action.delete.question');

		if (!confirm(question)) {
			throw new Error('User canceled the action');
		}

		this.store.dispatch(new OrderActions.SetState(
			this.item(),
			StateEnum.deleted
		));
	}

	public activate(): void {
		this.store.dispatch(new OrderActions.SetState(
			this.item(),
			StateEnum.active
		));
	}

	public deactivate(): void {
		this.store.dispatch(new OrderActions.SetState(
			this.item(),
			StateEnum.archived
		));
	}

	public open(): void {
		this.store.dispatch(new OrderActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(new OrderActions.OpenFormToEditById(this.item()._id));
	}

}
