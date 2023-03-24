import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {themeControl} from '@src/scripts/theme-control';
import {handleNavbarVerticalCollapsed} from '@src/scripts/navbar-vertical';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true,
  selector: 'utility-sidebar-component',
  templateUrl: 'sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
})
export class SidebarComponent implements AfterViewInit {

  @HostBinding()
  class = 'navbar navbar-light navbar-vertical navbar-expand-xl';

  public ngAfterViewInit(): void {

    utils.docReady(handleNavbarVerticalCollapsed);
    utils.docReady(themeControl);

  }

}
