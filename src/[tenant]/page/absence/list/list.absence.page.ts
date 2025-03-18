import {ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {AbsenceState} from "@absence/infrastructure/state/absence/absence.state";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@absence/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@absence/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {AbsenceTableService} from "@absence/presentation/component/list/absence.table.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from '@environment/environment';
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {AbsenceTableNgxDatatableSmartResource} from "@page/absence/list/absence.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-absence-page',
	templateUrl: './list.absence.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		AsyncPipe,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableService,
			useClass: AbsenceTableService
		},
		{
			provide: TableNgxDatatableSmartResource,
			useClass: AbsenceTableNgxDatatableSmartResource,
		},
	]
})
export class ListAbsencePage extends ListPage<EAbsence> implements OnDestroy, OnInit {

	public readonly tableState$: Observable<ITableState<EAbsence>> = this.store.select(AbsenceState.tableState)
		.pipe(
			tap(() => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource)

	public constructor() {
		super();
		effect(() => {
			const filters = this.filters();
			this.tableNgxDatatableSmartResource.filters.set(filters);
		});
	}


	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('list_absence_page_initialized');
	}

	@Dispatch()
	public resetFilter() {
		return new AbsenceActions.UpdateTableState({
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

export default ListAbsencePage;
