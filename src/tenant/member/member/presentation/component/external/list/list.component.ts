import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/member/member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/member/member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MemberTableNgxDatatableSmartResource
} from "@tenant/member/member/presentation/ui/page/list/member.table-ngx-datatable.resource";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";

@Component({
	selector: 'member-external-list-component',
	template: `
		@if (initialized()) {

			<member-mobile-layout-list-component
				*ifDevice="['phone']"
				[showButtonGoToForm]="false"
				[isPage]="false"
			/>
			<member-desktop-layout-list-component *ifNotDevice="['phone']"/>
		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
		AppIfDeviceDirective,
		AppIfNotDeviceDirective,
	],
	standalone: true,
	providers: [
		{
			provide: TableNgxDatatableSmartResource,
			useClass: MemberTableNgxDatatableSmartResource,
		},
	]
})
export class MemberExternalListComponent extends ListPage {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;


}
