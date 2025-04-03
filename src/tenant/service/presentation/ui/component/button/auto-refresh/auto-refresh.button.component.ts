import {Component, inject, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'service-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="service-auto-refresh" (emitter)="reload()"/>
	`,
	providers: [
		TableNgxDatatableSmartResource
	],
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

	public reload() {
		this.tableNgxDatatableSmartResource.reload();
	}

}
