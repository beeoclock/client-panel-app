import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	PluginTableNgxDatatableResource
} from "@tenant/plugin/plugin/presentation/ui/page/list/plugin.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-tenant-plugin-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
	],
	standalone: true,
	providers: [
		{
			provide: TableNgxDatatableSmartResource,
			useClass: PluginTableNgxDatatableResource,
		},
	],
	host: {
		class: 'p-4 flex flex-wrap gap-4'
	},
	template: `
		<div class="w-full">
			<h1 class="text-2xl font-bold text-gray-800 mb-4">Grid Plugin Page</h1>
			<p class="text-gray-600">This is a simple grid plugin page example.</p>
		</div>
		@if (resource) {
			@for (plugin of resource.value().items; track plugin._id) {

				<div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl max-w-xs">
					<img class="w-full h-auto rounded-t-xl"
						 src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
						 alt="Card Image">
					<div class="p-4 md:p-5">
						<h3 class="text-lg font-bold text-gray-800">
							Card title
						</h3>
						<p class="mt-1 text-gray-500">
							Some quick example text to build on the card title and make up the bulk of the card's content.
						</p>
						<a class="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
						   href="#">
							Go somewhere
						</a>
					</div>
				</div>
			}
		}
	`
})
export class GridPluginPage extends ListPage implements OnDestroy, OnInit {

	public readonly resource = this.tableNgxDatatableSmartResource?.resource;

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('plugin_grid_page_initialized');
	}

}

export default GridPluginPage;
