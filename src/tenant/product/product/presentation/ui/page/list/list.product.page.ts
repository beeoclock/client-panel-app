import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {
	ProductTableNgxDatatableSmartResource
} from "@tenant/product/product/presentation/ui/page/list/product.table-ngx-datatable.resource";
import {
	MobileLayoutListComponent
} from "@tenant/product/product/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/product/product/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {ProductDataActions} from "@tenant/product/product/infrastructure/state/data/product.data.actions";

@Component({
    selector: 'app-list-product-page',
    templateUrl: './list.product.page.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TranslateModule,
        AsyncPipe,
        MobileLayoutListComponent,
        DesktopLayoutListComponent,
    ],
    standalone: true,
    providers: [
        DatePipe,
        {
            provide: TableNgxDatatableSmartResource,
            useClass: ProductTableNgxDatatableSmartResource,
        },
    ],
})
export class ListProductPage extends ListPage implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			ProductDataActions.UpdateItem,
			ProductDataActions.CreateItem,
			ProductDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

    public override ngOnInit() {
        super.ngOnInit();
        this.analyticsService.logEvent('product_list_page_initialized');
    }

}

export default ListProductPage;
