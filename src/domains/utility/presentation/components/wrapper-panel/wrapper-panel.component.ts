import {Component, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/components/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/components/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/components/footer/footer.component';
import {ModalComponent} from '@utility/presentation/components/modal/modal.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'utility-wrapper-panel-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <utility-sidebar-component></utility-sidebar-component>
        <div class="content">
          <utility-navbar-component></utility-navbar-component>
          <router-outlet></router-outlet>
          <utility-footer-component></utility-footer-component>
        </div>
        <utility-modal-component></utility-modal-component>
      </div>
    </main>

  `,
  imports: [SidebarComponent, NavbarComponent, FooterComponent, ModalComponent, RouterOutlet],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent {

}


