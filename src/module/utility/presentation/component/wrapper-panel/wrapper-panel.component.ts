import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/component/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/component/footer/footer.component';
import {Router, RouterOutlet} from '@angular/router';
import {Auth} from '@angular/fire/auth';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'utility-wrapper-panel-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container-fluid position-relative" data-layout="container">
        <utility-sidebar-component></utility-sidebar-component>
        <div class="content">
          <utility-navbar-component></utility-navbar-component>
          <router-outlet></router-outlet>
        </div>
        <utility-stream-toast-component></utility-stream-toast-component>
      </div>
    </main>
  `,
  imports: [SidebarComponent, NavbarComponent, FooterComponent, RouterOutlet, StreamToastComponent],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent implements AfterViewInit {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly document = inject(DOCUMENT);
  private checkerTimer: undefined | NodeJS.Timeout;
  private isUserOnWebSite = true;

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/', 'identity']);
      } else {
        this.initNotificationChecker();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.initDetectorIfUserHasActiveWebsite();
  }

  private initNotificationChecker(): void {
    if (!this.checkerTimer) {
      this.checkerTimer = setTimeout(() => {
        if (this.isUserOnWebSite) {

          console.log('TODO: IMPLEMENT REQUEST TO GET NOTIFICATION!')

        }

        this.checkerTimer = undefined;
        this.initNotificationChecker();

      }, 60_000);
    }
  }

  private initDetectorIfUserHasActiveWebsite(): void {
    this.document.onvisibilitychange = () => {
      this.isUserOnWebSite = !this.document.hidden;
    };
  }
}


