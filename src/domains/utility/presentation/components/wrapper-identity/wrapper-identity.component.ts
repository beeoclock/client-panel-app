import {Component, ViewEncapsulation} from '@angular/core';
import SidebarComponent from '@utility/presentation/components/sidebar/sidebar.component';
import CustomizeComponent from '@utility/presentation/components/customize/customize.component';
import NavbarComponent from '@utility/presentation/components/navbar/navbar.component';
import FooterComponent from '@utility/presentation/components/footer/footer.component';
import ModalComponent from '@utility/presentation/components/modal/modal.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <router-outlet></router-outlet>
      </div>
    </main>

  `,
  imports: [SidebarComponent, CustomizeComponent, NavbarComponent, FooterComponent, ModalComponent, RouterOutlet],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

