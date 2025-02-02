import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import ECustomer from "@core/entity/e.customer";

@Component({
	selector: 'customer-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="customer-auto-refresh" (emitter)="forceRefresh()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	public readonly resetPage = input(false);

	public readonly resetParams = input(false);

	private readonly customerStore = inject(ECustomer.store);

	public forceRefresh() {
		this.customerStore.getItems({
			resetPage: this.resetPage(),
			resetParams: this.resetParams(),
		})
	}

}
