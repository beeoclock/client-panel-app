import {afterNextRender, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@shared/list.page";
import {TranslateModule} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {
	DesktopLayoutListComponent
} from "@tenant/member/absence/presentation/ui/component/list/layout/desktop/desktop.layout.list.component";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/ui/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	AbsenceTableNgxDatatableSmartResource
} from "@tenant/member/absence/presentation/ui/page/list/absence.table-ngx-datatable.resource";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ofActionSuccessful} from "@ngxs/store";
import {tap} from "rxjs";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";
import {AppIfDeviceDirective, AppIfNotDeviceDirective} from "@shared/presentation/directives/device";
import {
	MobileLayoutListComponent
} from "@tenant/member/absence/presentation/ui/component/list/layout/mobile/mobile.layout.list.component";

@Component({
	selector: 'app-list-absence-page',
	template: `
		@if (initialized()) {
			<app-absence-mobile-layout-list-component
				*ifDevice="['phone']"/>
			<absence-desktop-layout-list-component
				*ifNotDevice="['phone']"/>
		} @else {

			<div class="p-4">
				{{ 'keyword.capitalize.initializing' | translate }}...
			</div>
		}
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DesktopLayoutListComponent,
		AppIfDeviceDirective,
		MobileLayoutListComponent,
		AppIfNotDeviceDirective,
	],
	standalone: true,
	providers: [
		DatePipe,
		{
			provide: TableNgxDatatableSmartResource,
			useClass: AbsenceTableNgxDatatableSmartResource,
		},
	]
})
export class GridAbsencePage extends ListPage {

	public readonly actionsSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			AbsenceDataActions.UpdateItem,
			AbsenceDataActions.CreateItem,
			AbsenceDataActions.SetState,
		),
		tap((payload) => {
			this.tableNgxDatatableSmartResource?.refreshDiscoveredPages();
		})
	).subscribe();

	public constructor() {
		super();
		afterNextRender(() => {
			this.analyticsService.logEvent('list_absence_page_initialized');
		})
	}

}

export default GridAbsencePage;
