import {afterNextRender, ChangeDetectionStrategy, Component, ViewEncapsulation,} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {
	ProductTableNgxDatatableSmartResource
} from "@tenant/product/product/presentation/ui/page/list/product.table-ngx-datatable.resource";
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
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";
import {
	MobileLayoutListComponent
} from "@tenant/product/product/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'app-list-product-page',
	template: `
		@if (initialized()) {

			<product-mobile-layout-list-component *ifDevice="['phone']"/>
			<product-desktop-layout-list-component *ifNotDevice="['phone']"/>

		} @else {
			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
		AppIfDeviceDirective,
		MobileLayoutListComponent,
		AppIfNotDeviceDirective,
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
export class ListProductPage extends ListPage  {

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

	public constructor() {
		super();
		afterNextRender(() => {
			this.analyticsService.logEvent('product_list_page_initialized');
		})
	}

}

export default ListProductPage;
