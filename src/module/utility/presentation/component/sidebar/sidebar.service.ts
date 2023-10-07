import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ActivationStart, Router} from "@angular/router";
import {filter} from "rxjs";
import {MAIN_CONTAINER_ID, SIDEBAR_ID} from "@src/token";

enum SidebarContentEnum {
	MENU = 'MENU',
	PROFILE = 'PROFILE'
}

@Injectable({
	providedIn: "root"
})
export class SidebarService {

	public readonly sidebarId = inject(SIDEBAR_ID);
	public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
	public readonly document = inject(DOCUMENT);
	public readonly breakpointObserver = inject(BreakpointObserver);
	public readonly router = inject(Router);
	public autoCollapse = true;
	public setMarginToMainContainer = true;
	public readonly containersStatus = {
		sidebarId: true,
		mainContainerId: true
	};

	#currentContent: SidebarContentEnum = SidebarContentEnum.MENU;

	public get currentContent(): SidebarContentEnum {
		return this.#currentContent;
	}

	public get sidebarContentEnum(): typeof SidebarContentEnum {
		return SidebarContentEnum;
	}

	constructor() {
		this.breakpointObserver.observe(['(max-width: 639px)'])
			.subscribe((state: BreakpointState) => {
				this.autoCollapse = state.matches;
				this.setMarginToMainContainer = !state.matches;
				this.toggleSidebar(!this.autoCollapse);
			});
	}

	public toggleSidebar(force?: boolean): void {
		this.containersStatus.mainContainerId = force ?? !this.containersStatus.mainContainerId;
		this.containersStatus.sidebarId = force ?? !this.containersStatus.sidebarId;
		this.document.getElementById(this.sidebarId)?.classList?.toggle('md:translate-x-16', this.containersStatus.mainContainerId);
		this.document.getElementById(this.sidebarId)?.classList?.toggle('translate-x-0', this.containersStatus.mainContainerId);
		if (this.setMarginToMainContainer) {
			if (this.containersStatus.sidebarId) {
				this.document.getElementById(this.mainContainerId)?.classList?.add('sm:ml-80');
				this.document.getElementById(this.mainContainerId)?.classList?.remove('sm:ml-16');
			} else {
				this.document.getElementById(this.mainContainerId)?.classList?.remove('sm:ml-80');
				this.document.getElementById(this.mainContainerId)?.classList?.add('sm:ml-16');
			}
		}
	}

	public switchOnMenu(): void {
		this.#currentContent = SidebarContentEnum.MENU;
	}

	public switchOnProfile(): void {
		this.#currentContent = SidebarContentEnum.PROFILE;
	}

	public detectAutoClose(): void {
		if (this.autoCollapse) {
			this.toggleSidebar(false);
		}
	}

	public initialize(): void {

		this.router.events.pipe(
			filter((event) => event instanceof ActivationStart)
		).subscribe(() => {
			this.detectAutoClose();
		});

		if (this.autoCollapse) {
			this.toggleSidebar(false);
		}

	}

	public toggleSidebarAndSwitch(contentEnum: SidebarContentEnum) : void{
		if (contentEnum === this.currentContent) {
			this.toggleSidebar();
			return;
		}

		this.#currentContent = contentEnum;
		this.toggleSidebar(true);
	}

}
