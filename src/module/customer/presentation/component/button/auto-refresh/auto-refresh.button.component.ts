import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";

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

	@Input()
	public resetPage = false;

	@Input()
	public resetParams = false;

	private readonly store = inject(Store);

	public forceRefresh() {
		this.store.dispatch(new CustomerActions.GetList({
			resetPage: this.resetPage,
			resetParams: this.resetParams,
		}))
	}

}
