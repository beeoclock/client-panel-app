import {afterNextRender, Component, ViewEncapsulation} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {tap} from "rxjs";
import {
	MobileLayoutListComponent
} from "@tenant/member/member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	DesktopLayoutListComponent
} from "@tenant/member/member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MemberTableNgxDatatableSmartResource
} from "@tenant/member/member/presentation/ui/page/list/member.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";

@Component({
	selector: 'app-list-member-page',
	template: `

		@if (initialized()) {
			<member-mobile-layout-list-component *ifDevice="['phone']"/>
			<member-desktop-layout-list-component *ifNotDevice="['phone']"/>
		} @else {
			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
		AppIfDeviceDirective,
		AppIfNotDeviceDirective,
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
export class ListMemberPage extends ListPage {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			MemberDataActions.UpdateItem,
			MemberDataActions.CreateItem,
			MemberDataActions.SetState,
			MemberDataActions.SetStatus,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public constructor() {
		super();
		afterNextRender(() => {
			this.analyticsService.logEvent('member_list_page_initialized');
		})
	}


}

export default ListMemberPage;
