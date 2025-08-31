import {afterNextRender, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	BalanceTableNgxDatatableSmartResource
} from "@tenant/balance/presentation/ui/page/list/balance.table-ngx-datatable.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/balance/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {explicitEffect} from "ngxtension/explicit-effect";
import {SyncManager} from "@core/system/infrastructure/sync-manager/sync-manager";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";
import {
	MobileLayoutListComponent
} from "@tenant/balance/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'app-list-balance-page',
	template: `
		@if (initialized()) {
			<balance-mobile-layout-list-component *ifDevice="['phone']"/>
			<balance-desktop-layout-list-component *ifNotDevice="['phone']"/>
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
		AppIfNotDeviceDirective,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: BalanceTableNgxDatatableSmartResource,
		},
	]
})
export class ListBalancePage extends ListPage {

	private readonly isSyncing = toSignal(SyncManager.isSyncing$);

	public constructor() {
		super();
		explicitEffect([this.isSyncing], ([isSyncing]) => {
			if (isSyncing) {
				return;
			}
			this.tableNgxDatatableSmartResource?.reload();
		});
		afterNextRender(() => {
			this.analyticsService.logEvent('balance_list_page_initialized');
		})
	}

}

export default ListBalancePage;
