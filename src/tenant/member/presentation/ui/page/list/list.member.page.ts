import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {tap} from "rxjs";
import {
	MobileLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MemberTableNgxDatatableSmartResource
} from "@tenant/member/presentation/ui/page/list/member.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {MemberDataActions} from "@tenant/member/infrastructure/state/data/member.data.actions";

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
			provide: TableNgxDatatableSmartResource,
			useClass: MemberTableNgxDatatableSmartResource,
		},
	]
})
export class ListMemberPage extends ListPage implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			MemberDataActions.UpdateItem,
			MemberDataActions.CreateItem,
			MemberDataActions.SetState,
			MemberDataActions.SetStatus,
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
