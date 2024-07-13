import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {AbsenceState} from "@absence/state/absence/absence.state";
import {Observable, tap} from "rxjs";
import {ITableState} from "@utility/domain/table.state";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@absence/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TableListComponent} from "@absence/presentation/component/list/table/table.list.component";
import {CardListComponent} from "@absence/presentation/component/list/card/card.list.component";
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
		StarterComponent,
		TranslateModule,
		FilterComponent,
		DropdownComponent,
		RouterLink,
		NgIf,
		AsyncPipe,
		PrimaryButtonDirective,
		NotFoundTableDataComponent,
		CardListComponent,
		TableListComponent,
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
export class ListAbsencePage extends ListPage {

	public readonly tableState$: Observable<ITableState<IAbsenceDto>> = this.store.select(AbsenceState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}

export default ListAbsencePage;
