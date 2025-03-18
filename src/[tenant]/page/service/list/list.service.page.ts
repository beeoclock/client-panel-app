import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
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
	DesktopLayoutListComponent
} from "@service/presentation/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'app-list-service-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		DesktopLayoutListComponent,
	],
	providers: [
		{
			provide: TableService,
			useClass: ServiceTableService
		}
	],
	template: `
		@if (initialized.isOn) {
			@if (isMobile$ | async) {
				<!--<service-mobile-layout-list-component-->
				<!--[tableState]="tableState$ | async"/>-->
			} @else {
				<service-desktop-layout-list-component/>
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
