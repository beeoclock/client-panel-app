import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {
	DesktopLayoutListComponent
} from "@tenant/product/product-tag/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	ProductTagTableNgxDatatableSmartResource
} from "@tenant/product/product-tag/presentation/ui/page/list/product-tag.table-ngx-datatable.resource";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {ProductTagDataActions} from "@tenant/product/product-tag/infrastructure/state/data/product-tag.data.actions";

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

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			ProductTagDataActions.UpdateItem,
			ProductTagDataActions.CreateItem,
			ProductTagDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('product_tag_list_page_initialized');
	}

}

export default ListProductTagPage;
