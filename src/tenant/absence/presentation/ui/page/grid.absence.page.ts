import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, DatePipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@tenant/absence/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@tenant/absence/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	AbsenceTableNgxDatatableSmartResource
} from "@tenant/absence/presentation/ui/page/absence.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {AbsenceDataActions} from "@tenant/absence/infrastructure/state/data/absence.data.actions";

@Component({
	selector: 'app-list-absence-page',
	templateUrl: './grid.absence.page.html',
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
			provide: TableNgxDatatableSmartResource,
			useClass: AbsenceTableNgxDatatableSmartResource,
		},
	]
})
export class GridAbsencePage extends ListPage implements OnDestroy, OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			AbsenceDataActions.UpdateItem,
			AbsenceDataActions.CreateItem,
			AbsenceDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('list_absence_page_initialized');
	}

}

export default GridAbsencePage;
