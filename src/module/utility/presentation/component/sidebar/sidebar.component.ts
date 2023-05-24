import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {handleNavbarVerticalCollapsed} from '@src/script/navbar-vertical';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Auth} from "@angular/fire/auth";

interface IMenuItem {
  label: string;
  url?: string;
  icon?: string;
  target?: '_blank';
  disabled?: boolean;
  routerLinkActiveOptions: {
    exact: boolean;
  } | IsActiveMatchOptions;
  items?: IMenuItem[]
}

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

  public readonly auth = inject(Auth);

  public readonly menu: IMenuItem[] = [
    {
      label: 'Dashboard',
      url: '/dashboard',
      icon: 'bi bi-pie-chart',
      routerLinkActiveOptions: {
        exact: true
      }
    },
    {
      label: 'Customers',
      url: '/customer',
      icon: 'bi bi-person-vcard',
      routerLinkActiveOptions: {
        paths: "exact",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      label: 'Employees',
      url: '/employee',
      icon: 'bi bi-people',
      routerLinkActiveOptions: {
        paths: "exact",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      label: 'Service',
      url: '/service',
      icon: 'bi bi-shop-window',
      routerLinkActiveOptions: {
        paths: "exact",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      label: 'Events',
      icon: 'bi bi-calendar2-week',
      routerLinkActiveOptions: {
        exact: true
      },
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
            paths: "exact",
            matrixParams: "ignored",
            queryParams: "ignored",
            fragment: "ignored",
          }
        },
        {
          label: 'Add event',
          url: '/event/form',
          icon: 'bi bi-plus',
          routerLinkActiveOptions: {
            exact: true
          }
        },
      ]
    },
    {
      label: 'Private',
      icon: 'bi bi-person',
      routerLinkActiveOptions: {
        exact: true
      },
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
