import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {
	ProductTableNgxDatatableSmartResource
} from "@tenant/product/presentation/ui/page/list/product.table-ngx-datatable.resource";
import {
	MobileLayoutListComponent
} from "@tenant/product/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/product/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";

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

    public override ngOnInit() {
        super.ngOnInit();
        this.analyticsService.logEvent('product_list_page_initialized');
    }

}

export default ListProductPage;
