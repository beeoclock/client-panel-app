import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/components/sidebar/sidebar.component';
import {CustomizeComponent} from '@utility/presentation/components/customize/customize.component';
import {NavbarComponent} from '@utility/presentation/components/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/components/footer/footer.component';
import {ModalComponent} from '@utility/presentation/components/modal/modal.component';
import {RouterOutlet} from '@angular/router';
import {utils} from '@src/scripts/utls';
import {scrollbarInit} from '@src/scripts/scrollbar';
import {scrollInit} from '@src/scripts/scroll';

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
    <utility-customize-component></utility-customize-component>

  `,
  imports: [SidebarComponent, CustomizeComponent, NavbarComponent, FooterComponent, ModalComponent, RouterOutlet],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent implements AfterViewInit {

  public ngAfterViewInit(): void {

    utils.docReady(scrollbarInit);
    utils.docReady(scrollInit);

  }

}


