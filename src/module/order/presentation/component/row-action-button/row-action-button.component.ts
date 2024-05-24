import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Store} from "@ngxs/store";
import {TranslateModule} from "@ngx-translate/core";
import {Router, RouterLink} from "@angular/router";
import {OrderActions} from "@order/state/order/order.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

@Component({
	selector: 'app-order-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!--
					(activate)="activate()"
					(deactivate)="deactivate()"-->
		<utility-table-column-action
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[id]="id">
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
		RouterLink
	]
})
export class RowActionButtonComponent {

	@Input()
	public id!: string;

	@Input({required: true})
	public item!: IOrderDto;

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(): void {
		// const {active} = this.item;
		//
		// if (active) {
		//
		// 	return alert('You can\'t delete active order');
		//
		// }
		this.store.dispatch(new OrderActions.DeleteItem(this.item._id));
	}

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
		this.store.dispatch(new OrderActions.OpenDetailsById(this.item._id));
	}

	public edit(): void {
		this.store.dispatch(new OrderActions.OpenFormToEditById(this.item._id));
	}

}
