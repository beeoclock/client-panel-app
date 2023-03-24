import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {themeControl} from '@src/scripts/theme-control';
import {handleNavbarVerticalCollapsed} from '@src/scripts/navbar-vertical';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'utility-sidebar-component',
  templateUrl: 'sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
})
export class SidebarComponent implements AfterViewInit {

  @HostBinding()
  class = 'navbar navbar-light navbar-vertical navbar-expand-xl';

  public readonly menu: {
    label: string;
    items: {
      label: string;
      url: string;
      icon: string;
      target?: '_blank';
      disabled?: boolean;
    }[]
  }[] = [
    {
      label: '',
      items: [
        {
          label: 'Dashboard',
          url: '/utility/dashboard',
          icon: 'bi bi-pie-chart-fill',
        },
        {
          label: 'Customers',
          url: '/users',
          icon: 'bi bi-person-vcard-fill'
        },
        {
          label: 'Employees',
          url: '/users',
          icon: 'bi bi-people-fill'
        },
        {
          label: 'Service',
          url: '/sensor-units',
          icon: 'bi bi-shop-window'
        },
        {
          label: 'Events',
          url: '/devices',
          icon: 'bi bi-calendar2-week-fill'
        },
        {
          label: 'Settings',
          url: '/settings',
          icon: 'bi bi-gear-fill'
        },
      ]
    }
  ];

  public ngAfterViewInit(): void {

    utils.docReady(handleNavbarVerticalCollapsed);
    utils.docReady(themeControl);

  }

}
