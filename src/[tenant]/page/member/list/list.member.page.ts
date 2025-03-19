import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {tap} from "rxjs";
import {
	MobileLayoutListComponent
} from "@member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {MemberTableService} from "@member/presentation/component/list/member.table.service";
import EMember from "@core/business-logic/member/entity/e.member";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {MemberTableNgxDatatableSmartResource} from "@page/member/list/member.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {MemberActions} from "@member/infrastructure/state/member/member.actions";

@Component({
	selector: 'app-list-member-page',
	templateUrl: './list.member.page.html',
	encapsulation: ViewEncapsulation.None,
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
			useClass: MemberTableService
		},
		{
			provide: TableNgxDatatableSmartResource,
			useClass: MemberTableNgxDatatableSmartResource,
		},
	]
})
export class ListMemberPage extends ListPage<EMember> implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			MemberActions.UpdateItem,
			MemberActions.CreateItem,
			MemberActions.SetState,
			MemberActions.SetStatus,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('member_list_page_initialized');
	}

}

export default ListMemberPage;
