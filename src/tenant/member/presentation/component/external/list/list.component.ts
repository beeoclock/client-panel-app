import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {ActiveEnum} from "@core/shared/enum";
import {
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	MemberTableNgxDatatableSmartResource
} from "@tenant/member/presentation/ui/page/list/member.table-ngx-datatable.resource";

@Component({
	selector: 'member-external-list-component',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
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

	protected override readonly getListParams = {
		active: ActiveEnum.YES
	};

}
