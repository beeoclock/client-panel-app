import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {tap} from "rxjs";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/member/roles/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {RoleDataActions} from "@tenant/member/roles/infrastructure/state/data/role.data.actions";
import {
	RoleTableNgxDatatableSmartResource
} from "@tenant/member/roles/presentation/ui/page/list/roles.table-ngx-datatable.resource";

@Component({
	selector: 'app-list-roles-page',
	templateUrl: './list.roles.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: RoleTableNgxDatatableSmartResource,
		},
	]
})
export class ListRolesPage extends ListPage implements OnInit {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			RoleDataActions.UpdateItem,
			RoleDataActions.CreateItem,
			RoleDataActions.SetState,
			RoleDataActions.SetStatus,
		),
		tap(() => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public override ngOnInit() {
		super.ngOnInit();
		this.analyticsService.logEvent('roles_list_page_initialized');
	}

}

export default ListRolesPage;
