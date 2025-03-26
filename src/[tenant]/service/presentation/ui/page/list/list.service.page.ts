import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {tap} from "rxjs";
import {ServiceActions} from "@[tenant]/service/infrastructure/state/service/service.actions";
import EService from "@core/business-logic/service/entity/e.service";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@[tenant]/service/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@[tenant]/service/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	ServiceTableNgxDatatableSmartResource
} from "@[tenant]/service/presentation/ui/page/list/service.table-ngx-datatable.resource";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";

@Component({
	selector: 'app-list-service-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
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
		@if (initialized.isOn) {
			@if (isMobile$ | async) {
				<service-mobile-layout-list-component />
			} @else {
				<service-desktop-layout-list-component />
			}

		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	standalone: true,
})
export class ListServicePage extends ListPage<EService> implements OnInit, OnDestroy {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			ServiceActions.UpdateItem,
			ServiceActions.CreateItem,
			ServiceActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('service_list_page_initialized');
	}

}

export default ListServicePage;
