import {afterNextRender, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {tap} from "rxjs";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@tenant/service/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/service/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	ServiceTableNgxDatatableSmartResource
} from "@tenant/service/presentation/ui/page/list/service.table-ngx-datatable.resource";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";

@Component({
	selector: 'app-list-service-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
		AppIfDeviceDirective,
		AppIfNotDeviceDirective,
	],
	providers: [
		DatePipe,
		CurrencyPipe,
		DurationVersionHtmlHelper,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: ServiceTableNgxDatatableSmartResource,
		},
	],
	template: `
		@if (initialized()) {
			<service-mobile-layout-list-component *ifDevice="['phone']"/>
			<service-desktop-layout-list-component *ifNotDevice="['phone']"/>
		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	standalone: true,
})
export class ListServicePage extends ListPage {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			ServiceActions.UpdateItem,
			ServiceActions.CreateItem,
			ServiceActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public constructor() {
		super();
		afterNextRender(() => {
			this.analyticsService.logEvent('service_list_page_initialized');
		});
	}

}

export default ListServicePage;
