import {Component, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {Observable, tap} from "rxjs";
import {RIMember} from "@member/domain";
import {MemberState} from "@member/state/member/member.state";
import {ITableState} from "@utility/domain/table.state";
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
		TranslateModule,
		AsyncPipe,
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

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('member_list_page_initialized');
	}

}

export default ListMemberPage;
