import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	PluginTableNgxDatatableResource
} from "@tenant/plugin/plugin/presentation/ui/page/list/plugin.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-plugin-page',
	templateUrl: './list.plugin.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: PluginTableNgxDatatableResource,
		},
	]
})
export class ListPluginPage extends ListPage implements OnDestroy, OnInit {

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('plugin_list_page_initialized');
	}

}

export default ListPluginPage;
