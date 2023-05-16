import {Component, inject, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/component/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/component/footer/footer.component';
import {Router, RouterOutlet} from '@angular/router';
import {Auth} from '@angular/fire/auth';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';

@Component({
  selector: 'utility-wrapper-panel-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container position-relative" data-layout="container">
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
export default class WrapperPanelComponent {
  private readonly router: Router = inject(Router);
  private readonly auth: Auth = inject(Auth);

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/', 'identity']);
      }
    });
  }

}


