import {AfterViewInit, Component, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/component/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/component/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, DOCUMENT, NgIf} from "@angular/common";
import {ModalComponent} from "@utility/presentation/component/modal/modal.component";
import {
  PageLoadingProgressBarComponent
} from "@utility/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";
import {Select, Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {IdTokenResult} from "@angular/fire/auth";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ServiceActions} from "@service/state/service/service.actions";
import {MemberActions} from "@member/state/member/member.actions";
import {EventActions} from "@event/state/event/event.actions";
import {CacheActions} from "@utility/state/cache/cache.actions";
import {MAIN_CONTAINER_ID} from "@src/token";

@Component({
  selector: 'utility-wrapper-panel-component',
  standalone: true,
  template: `
    <ng-container *ngIf="token$ | async">

      <utility-navbar-component></utility-navbar-component>
      <utility-sidebar-component></utility-sidebar-component>

      <div [id]="mainContainerId" class="content-container h-screen overflow-y-auto sm:ml-64 transition-all">
        <utility-page-loading-progress-bar></utility-page-loading-progress-bar>
        <router-outlet></router-outlet>
      </div>

    </ng-container>

  `,
  imports: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
    ModalComponent,
    PageLoadingProgressBarComponent,
    NgIf,
    AsyncPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent implements AfterViewInit, OnDestroy {

  public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
  private readonly document = inject(DOCUMENT);
  private checkerTimer: undefined | NodeJS.Timeout;
  private isUserOnWebSite = true;
  public readonly store = inject(Store);

  @Select(IdentityState.token)
  public readonly token$!: Observable<IdTokenResult | undefined>;

  constructor() {
    this.initNotificationChecker();
  }

  public ngAfterViewInit(): void {
    this.initDetectorIfUserHasActiveWebsite();
  }

  private clearNotificationChecker(): void {
    clearTimeout(this.checkerTimer);
    this.checkerTimer = undefined;
  }

  private initNotificationChecker(): void {
    if (!this.checkerTimer) {
      this.checkerTimer = setTimeout(() => {
        if (this.isUserOnWebSite) {

          console.log('TODO: IMPLEMENT REQUEST TO GET NOTIFICATION!')

        }

        this.clearNotificationChecker();
        this.initNotificationChecker();

      }, 60_000);
    }
  }

  private initDetectorIfUserHasActiveWebsite(): void {
    this.document.onvisibilitychange = () => {
      this.isUserOnWebSite = !this.document.hidden;
    };
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new CustomerActions.Init());
    this.store.dispatch(new ServiceActions.Init());
    this.store.dispatch(new MemberActions.Init());
    this.store.dispatch(new EventActions.Init());

    this.store.dispatch(new CacheActions.Init());
  }
}


