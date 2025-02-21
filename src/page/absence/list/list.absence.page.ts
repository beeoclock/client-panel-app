import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {AbsenceState} from "@absence/infrastructure/state/absence/absence.state";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@absence/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@absence/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {TableService} from "@utility/table.service";
import {AbsenceTableService} from "@absence/presentation/component/list/absence.table.service";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {environment} from '@src/environment/environment';

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
		{
			provide: TableService,
			useClass: AbsenceTableService
		}
	]
})
export class ListAbsencePage extends ListPage<IAbsence.Entity> implements OnDestroy, OnInit {

	public readonly tableState$: Observable<ITableState<IAbsence.Entity>> = this.store.select(AbsenceState.tableState)
		.pipe(
			tap(() => {
				this.changeDetectorRef.detectChanges();
			})
		);

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
