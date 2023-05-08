import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {handleNavbarVerticalCollapsed} from '@src/script/navbar-vertical';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
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
      routerLinkActiveOptions: {
        exact: boolean;
      } | IsActiveMatchOptions
    }[]
  }[] = [
    {
      label: '',
      items: [
        {
          label: 'Dashboard',
          url: '/dashboard',
          icon: 'bi bi-pie-chart',
          routerLinkActiveOptions: {
            exact: true
          }
        },
      ]
    },
    {
      label: '',
      items: [
        {
          label: 'Customers',
          url: '/customer',
          icon: 'bi bi-person-vcard',
          routerLinkActiveOptions: {
            exact: true
          }
        },
        {
          label: 'Employees',
          url: '/employee',
          icon: 'bi bi-people',
          routerLinkActiveOptions: {
            exact: true
          }
        },
        {
          label: 'Service',
          url: '/service',
          icon: 'bi bi-shop-window',
          routerLinkActiveOptions: {
            exact: true
          }
        },
      ]
    },
    {
      label: 'Events',
      items: [
        {
          label: 'Calendar',
          url: '/event/calendar',
          icon: 'bi bi-calendar2-week',
          routerLinkActiveOptions: {
            exact: true
          }
        },
        {
          label: 'Table',
          url: '/event',
          icon: 'bi bi-list',
          routerLinkActiveOptions: {
            exact: true
          }
        },
      ]
    },
    {
      label: 'Private',
      items: [
        {
          label: 'Profile',
          url: '/company/profile',
          icon: 'bi bi-person',
          routerLinkActiveOptions: {
            exact: true
          }
        },
        {
          label: 'Settings',
          url: '/company/settings',
          icon: 'bi bi-gear',
          routerLinkActiveOptions: {
            exact: true
          }
        },
      ]
    }
  ];

  public ngAfterViewInit(): void {

    handleNavbarVerticalCollapsed();

  }

}
