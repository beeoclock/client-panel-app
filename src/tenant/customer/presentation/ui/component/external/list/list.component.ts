import {ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/customer/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {CustomerTableService} from "@tenant/customer/presentation/ui/component/list/customer.table.service";
import {TableService} from "@shared/table.service";

@Component({
	selector: 'customer-external-list-component',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		TranslateModule,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerTableService
		}
	]
})
export class CustomerExternalListComponent extends ListPage {

	@ViewChildren(MobileLayoutListComponent)
	public mobileLayoutListComponents!: QueryList<MobileLayoutListComponent>;

}
