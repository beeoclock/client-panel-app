import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SidebarService} from "@shared/presentation/component/sidebar/sidebar.service";
import {SIDEBAR_ID} from "@src/token";
import {MenuSidebarComponent} from "@shared/presentation/component/sidebar/menu/menu.sidebar.component";
import {ProfileSidebarComponent} from "@shared/presentation/component/sidebar/profile/profile.sidebar.component";
import {SyncButtonComponent} from "@shared/presentation/component/sync-button/sync-button.component";


@Component({
	standalone: true,
	selector: 'utility-sidebar-component',
	templateUrl: './sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		MenuSidebarComponent,
		ProfileSidebarComponent,
		SyncButtonComponent
	],
})
export class SidebarComponent implements AfterViewInit {

	public readonly sidebarId = inject(SIDEBAR_ID);
	public readonly sidebarService = inject(SidebarService);

	public ngAfterViewInit(): void {
		this.sidebarService.initialize();
	}
}
