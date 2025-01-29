import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";
import {SIDEBAR_ID} from "@src/token";
import {MenuSidebarComponent} from "@utility/presentation/component/sidebar/menu/menu.sidebar.component";
import {ProfileSidebarComponent} from "@utility/presentation/component/sidebar/profile/profile.sidebar.component";
import {Reactive} from "@utility/cdk/reactive";
import {SyncButtonComponent} from "@utility/presentation/component/sync-button/sync-button.component";
import {AsyncPipe} from "@angular/common";

@Component({
	standalone: true,
	selector: 'utility-sidebar-component',
	templateUrl: './sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		MenuSidebarComponent,
		ProfileSidebarComponent,
		SyncButtonComponent,
		AsyncPipe,
	]
})
export class SidebarComponent extends Reactive implements AfterViewInit {

	public readonly sidebarId = inject(SIDEBAR_ID);
	public readonly sidebarService = inject(SidebarService);

	public ngAfterViewInit(): void {
		this.sidebarService.initialize();
	}

}
