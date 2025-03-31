import {ChangeDetectionStrategy, Component, viewChild, ViewEncapsulation} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ListPage} from "@shared/list.page";
import {
	MobileLayoutListComponent
} from "@tenant/service/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@tenant/service/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'service-external-list-component',
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
	providers: []
})
export class ServiceExternalListComponent extends ListPage {

	public readonly mobileLayoutListComponents = viewChild(MobileLayoutListComponent);

}
