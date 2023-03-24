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
          icon: 'bi bi-pie-chart',
        },
        {
          label: 'Customers',
          url: '/customer',
          icon: 'bi bi-person-vcard'
        },
        {
          label: 'Employees',
          url: '/employee',
          icon: 'bi bi-people'
        },
        {
          label: 'Service',
          url: '/service',
          icon: 'bi bi-shop-window'
        },
        {
          label: 'Events',
          url: '/event',
          icon: 'bi bi-calendar2-week'
        },
        {
          label: 'Settings',
          url: '/company',
          icon: 'bi bi-gear'
        },
      ]
    }
  ];

  public ngAfterViewInit(): void {

    utils.docReady(handleNavbarVerticalCollapsed);
    utils.docReady(themeControl);

  }

}
