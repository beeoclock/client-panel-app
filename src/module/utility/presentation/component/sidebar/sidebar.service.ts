import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
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

  constructor() {
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        this.autoCollapse = state.matches;
        this.setMarginToMainContainer = !state.matches;
      });
  }

  public toggleSidebar(force?: boolean): void {
    this.document.getElementById(this.sidebarId)?.classList?.toggle('translate-x-0', force);
    if (this.setMarginToMainContainer) {
      this.document.getElementById(this.mainContainerId)?.classList?.toggle('sm:ml-64', force);
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

  }

}
