import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'payment-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="payment-auto-refresh" (emitter)="reload()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	public readonly resetPage = input(false);

	public readonly resetParams = input(false);

	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource, {optional: true});

	public reload() {
		this.tableNgxDatatableSmartResource?.reload();
	}

}
