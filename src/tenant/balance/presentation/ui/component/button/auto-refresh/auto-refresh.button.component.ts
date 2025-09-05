import {Component, inject, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@shared/presentation/ui/component/auto-refresh/auto-refresh.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'balance-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="balance-auto-refresh" (emitter)="forceRefresh()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

	public forceRefresh() {
		this.tableNgxDatatableSmartResource.reload();
	}

}
