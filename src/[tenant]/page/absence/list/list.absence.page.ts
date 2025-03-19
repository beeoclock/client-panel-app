import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
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
import EAbsence from "@core/business-logic/absence/entity/e.absence";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {AbsenceTableNgxDatatableSmartResource} from "@page/absence/list/absence.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";

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

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			AbsenceActions.UpdateItem,
			AbsenceActions.CreateItem,
			AbsenceActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('list_absence_page_initialized');
	}

}

export default ListAbsencePage;
