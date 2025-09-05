import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SidebarService} from "@shared/presentation/ui/component/sidebar/sidebar.service";
import {SIDEBAR_ID} from "@src/token";
import {MenuSidebarComponent} from "@shared/presentation/ui/component/sidebar/menu/menu.sidebar.component";
import {ProfileSidebarComponent} from "@shared/presentation/ui/component/sidebar/profile/profile.sidebar.component";
import {SyncButtonComponent} from "@shared/presentation/ui/component/sync-button/sync-button.component";
import {
	ConfigurationSidebarComponent
} from "@shared/presentation/ui/component/sidebar/configuration/configuration.sidebar.component";


@Component({
	standalone: true,
	selector: 'utility-sidebar-component',
	templateUrl: './sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		MenuSidebarComponent,
		ProfileSidebarComponent,
		SyncButtonComponent,
		ConfigurationSidebarComponent
	],
})
export class SidebarComponent implements AfterViewInit {

	public readonly sidebarId = inject(SIDEBAR_ID);
	public readonly sidebarService = inject(SidebarService);

	public ngAfterViewInit(): void {
		this.sidebarService.initialize();
	}
}
