import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, tap} from "rxjs";
import {RIMember} from "@member/domain";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
import {FilterComponent} from "@member/presentation/component/filter/filter.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {CardListComponent} from "@member/presentation/component/list/card/card.list.component";
import {TableListComponent} from "@member/presentation/component/list/table/table.list.component";
import {
	DesktopLayoutListComponent
} from "@member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {MemberTableService} from "@member/presentation/component/list/member.table.service";

@Component({
	selector: 'app-list-member-page',
	templateUrl: './list.member.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterLink,
		FilterComponent,
		NgIf,
		TranslateModule,
		AsyncPipe,
		FilterComponent,
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
			useClass: MemberTableService
		}
	]
})
export class ListMemberPage extends ListPage<RIMember> {

	public readonly tableState$: Observable<ITableState<RIMember>> = this.store.select(MemberState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}

export default ListMemberPage;
