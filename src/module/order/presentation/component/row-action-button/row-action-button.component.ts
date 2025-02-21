import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";

@Component({
	selector: 'app-order-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!--
					(activate)="activate()"
					(deactivate)="deactivate()"-->
		<utility-table-column-action
			(open)="open()"
			(edit)="edit()"
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

	// public delete(): void {
	//
	// 	const question = this.translateService.instant('order.action.delete.question');
	//
	// 	if (!confirm(question)) {
	//
	// 		throw new Error('User canceled the action');
	// 	}
	// 	this.store.dispatch(new OrderActions.DeleteItem(this.item()._id));
	// }

	// public activate(): void {
	// 	this.store.dispatch(new OrderActions.UnarchiveItem(this.item._id));
	// }
	//
	// public deactivate(): void {
	// 	this.store.dispatch(new OrderActions.ArchiveItem(this.item._id));
	// }
	//
	// public async archive(id: string): Promise<void> {
	// 	await firstValueFrom(this.store.dispatch(
	// 		new OrderActions.ArchiveItem(id)));
	// }

	public open(): void {
		this.store.dispatch(new OrderActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(new OrderActions.OpenFormToEditById(this.item()._id));
	}

}
