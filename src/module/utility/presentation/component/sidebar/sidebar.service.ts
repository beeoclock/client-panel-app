import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ActivationStart, Router} from "@angular/router";
import {filter} from "rxjs";
import {MAIN_CONTAINER_ID, SIDEBAR_ID} from "@src/token";

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

  public initialize(): void {

    this.router.events.pipe(
      filter((event) => event instanceof ActivationStart)
    ).subscribe(() => {
      if (this.autoCollapse) {
        this.toggleSidebar(false);
      }
    });

		if (this.autoCollapse) {
			this.toggleSidebar(false);
		}

  }

}
