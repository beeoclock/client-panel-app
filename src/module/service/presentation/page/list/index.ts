import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {IService} from '@service/domain';
import {ListPage} from "@utility/list.page";
import {Observable, tap} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {ServiceState} from "@service/state/service/service.state";
import {ITableState} from "@utility/domain/table.state";
import {
	MobileLayoutListComponent
} from "@service/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {
	DesktopLayoutListComponent
} from "@service/presentation/component/list/layout/desktop/desktop.layout.list.component";

@Component({
	selector: 'service-list-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		NgIf,
		TranslateModule,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = ServiceActions;

	public readonly tableState$: Observable<ITableState<IService>> = this.store.select(ServiceState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}
