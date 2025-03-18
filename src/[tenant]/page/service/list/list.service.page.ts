import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ServiceState} from "@service/infrastructure/state/service/service.state";
import {ITableState} from "@utility/domain/table.state";
import {TableService} from "@utility/table.service";
import {ServiceTableService} from "@service/presentation/component/list/service.table.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {environment} from "@environment/environment";
import EService from "@core/business-logic/service/entity/e.service";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@service/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {ServiceTableNgxDatatableSmartResource} from "@page/service/list/service.table-ngx-datatable.resource";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";

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
			provide: TableService,
			useClass: ServiceTableService
		},
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

	public readonly tableState$: Observable<ITableState<EService>> = this.store.select(ServiceState.tableState)
		.pipe(
			tap(() => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('service_list_page_initialized');
	}

	@Dispatch()
	public resetFilter() {
		return new ServiceActions.UpdateTableState({
			filters: {},
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
			pageSize: environment.config.pagination.pageSize
		});
	}

	public override ngOnDestroy() {
		this.resetFilter();
		super.ngOnDestroy();
	}

}

export default ListServicePage;
