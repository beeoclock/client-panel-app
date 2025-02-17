import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ServiceState} from "@service/infrastructure/state/service/service.state";
import {ITableState} from "@utility/domain/table.state";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@service/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {TableService} from "@utility/table.service";
import {ServiceTableService} from "@service/presentation/component/list/service.table.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {IService} from "@src/core/business-logic/service/interface/i.service";

@Component({
	selector: 'app-list-service-page',
	templateUrl: './list.service.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	providers: [
		{
			provide: TableService,
			useClass: ServiceTableService
		}
	],
	standalone: true,
})
export class ListServicePage extends ListPage<IService.DTO> implements OnInit, OnDestroy {

	public readonly tableState$: Observable<ITableState<IService.DTO>> = this.store.select(ServiceState.tableState)
		.pipe(
			tap((tableState) => {
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
			pageSize: 20
		});
	}

	public override ngOnDestroy() {
		this.resetFilter();
		super.ngOnDestroy();
	}

}

export default ListServicePage;
