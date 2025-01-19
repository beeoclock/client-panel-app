import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from '@angular/core';
import { ListPage } from '@utility/list.page';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { ProductTableService } from '@product/presentation/component/list/product.table.service';
import { TableService } from '@utility/table.service';
import { IProduct } from '@product/domain';
import { ITableState } from '@utility/domain/table.state';
import { ProductState } from '@product/state/product/product.state';
import { Observable, tap } from 'rxjs';
import { DesktopLayoutListComponent } from '@product/presentation/component/list/layout/desktop/desktop.layout.list.component';
import { MobileLayoutListComponent } from '@product/presentation/component/list/layout/mobile/mobile.layout.list.component';

@Component({
	selector: 'app-list-product-page',
	templateUrl: './list.product.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		DesktopLayoutListComponent,
		MobileLayoutListComponent
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: ProductTableService,
		},
	],
})
export class ListProductPage extends ListPage<IProduct> {
	public readonly tableState$: Observable<ITableState<IProduct>> = this.store
		.select(ProductState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('product_list_page_initialized');
	}
}

export default ListProductPage;
