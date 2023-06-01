import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {handleNavbarVerticalCollapsed} from '@src/script/navbar-vertical';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Auth} from "@angular/fire/auth";
import {TranslateModule} from "@ngx-translate/core";

interface IMenuItem {
  url?: string;
  icon?: string;
  translateKey: string;
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
    RouterLinkActive,
    TranslateModule
  ],
})
export class SidebarComponent implements AfterViewInit {

  public readonly auth = inject(Auth);

  public readonly menu: IMenuItem[] = [
    {
      url: '/dashboard',
      translateKey: 'sidebar.dashboard',
      icon: 'bi bi-pie-chart',
      routerLinkActiveOptions: {
        exact: true
      }
    },
    {
      url: '/customer',
      translateKey: 'sidebar.customers',
      icon: 'bi bi-person-vcard',
      routerLinkActiveOptions: {
        paths: "subset",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      url: '/employee',
      translateKey: 'sidebar.employees',
      icon: 'bi bi-people',
      routerLinkActiveOptions: {
        paths: "subset",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      url: '/service',
      translateKey: 'sidebar.services',
      icon: 'bi bi-shop-window',
      routerLinkActiveOptions: {
        paths: "subset",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      }
    },
    {
      translateKey: 'sidebar.events',
      icon: 'bi bi-calendar2-week',
      routerLinkActiveOptions: {
        exact: true
      },
      url: '/event',
    },
    {
      icon: 'bi bi-person',
      translateKey: 'sidebar.private',
      routerLinkActiveOptions: {
        exact: true
      },
      items: [
        {
          translateKey: 'sidebar.profile',
          url: '/company/profile',
          icon: 'bi bi-person',
          routerLinkActiveOptions: {
            exact: true
          }
        },
        {
          translateKey: 'sidebar.settings',
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
