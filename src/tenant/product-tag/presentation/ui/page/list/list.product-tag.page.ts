import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/product-tag/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	ProductTagTableNgxDatatableSmartResource
} from "@tenant/product-tag/presentation/ui/page/list/product-tag.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-product-tag-page',
	templateUrl: './list.product-tag.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: ProductTagTableNgxDatatableSmartResource,
		},
	],
})
export class ListProductTagPage extends ListPage implements OnInit {

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('product_tag_list_page_initialized');
	}

}

export default ListProductTagPage;
