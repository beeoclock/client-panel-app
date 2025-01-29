import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";
import {SIDEBAR_ID} from "@src/token";
import {MenuSidebarComponent} from "@utility/presentation/component/sidebar/menu/menu.sidebar.component";
import {ProfileSidebarComponent} from "@utility/presentation/component/sidebar/profile/profile.sidebar.component";
import {IsOnlineService} from "@utility/cdk/is-online.service";
import {Reactive} from "@utility/cdk/reactive";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";

const DEFAULT_DURATION = 300;

@Component({
	standalone: true,
	selector: 'utility-sidebar-component',
	templateUrl: './sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		MenuSidebarComponent,
		ProfileSidebarComponent
	],
	animations: [
		trigger('collapse', [
			state('false', style({height: AUTO_STYLE, visibility: AUTO_STYLE})),
			state('true', style({height: '0', visibility: 'hidden'})),
			transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
			transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
		])
	]
})
export class SidebarComponent extends Reactive implements AfterViewInit {

	public readonly sidebarId = inject(SIDEBAR_ID);
	public readonly sidebarService = inject(SidebarService);
	private readonly isOnlineService = inject(IsOnlineService);
	public collapsed = false;

	public readonly isOnline$ = this.isOnlineService.isOnline$
		.pipe(this.takeUntil())
		.subscribe((isOnline) => {
			this.toggle(isOnline);
		});

	public ngAfterViewInit(): void {
		this.sidebarService.initialize();
	}

	public toggle(force?: boolean): void {
		this.collapsed = force ?? !this.collapsed;
	}

	public expand() {
		this.collapsed = false;
	}

	public collapse() {
		this.collapsed = true;
	}
}
