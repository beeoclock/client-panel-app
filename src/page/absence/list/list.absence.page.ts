import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {AbsenceState} from "@absence/state/absence/absence.state";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@absence/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@absence/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {TableService} from "@utility/table.service";
import {AbsenceTableService} from "@absence/presentation/component/list/absence.table.service";

@Component({
	selector: 'app-list-absence-page',
	templateUrl: './list.absence.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		NgIf,
		AsyncPipe,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
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
export class ListAbsencePage extends ListPage<IAbsenceDto> {

	public readonly tableState$: Observable<ITableState<IAbsenceDto>> = this.store.select(AbsenceState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('list_absence_page_initialized');
	}

}

export default ListAbsencePage;
