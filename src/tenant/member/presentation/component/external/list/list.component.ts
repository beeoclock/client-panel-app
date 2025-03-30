import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@utility/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/member/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {ActiveEnum} from "@core/shared/enum";
import {MemberTableService} from "@tenant/member/presentation/component/list/member.table.service";
import {TableService} from "@utility/table.service";
import EMember from "@core/business-logic/member/entity/e.member";

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
			provide: TableService,
			useClass: MemberTableService
		}
	]
})
export class MemberExternalListComponent extends ListPage<EMember> {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

	protected override readonly getListParams = {
		active: ActiveEnum.YES
	};

}
