import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

@Component({
	selector: 'app-absence-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-auto-refresh-component id="absence-auto-refresh" (emitter)="forceRefresh()"/>
	`,
	imports: [
		AutoRefreshComponent
	]
})
export class AutoRefreshButtonComponent {

	public readonly resetPage = input(false);

	public readonly resetParams = input(false);

	private readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

	public forceRefresh() {
		this.tableNgxDatatableSmartResource.reset();
			this.tableNgxDatatableSmartResource.parameters.update((parameters) => ({
			...parameters,
			page: 1,
		}))
	}

}
