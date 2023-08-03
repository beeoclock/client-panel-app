import {Component, inject, ViewEncapsulation} from '@angular/core';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {Auth} from "@angular/fire/auth";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {IdentityState} from "@identity/state/identity/identity.state";

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
export class SidebarComponent {

  public readonly auth = inject(Auth);
  public readonly store = inject(Store);

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
    // {
    //   url: '/member',
    //   translateKey: 'sidebar.members',
    //   icon: 'bi bi-people',
    //   routerLinkActiveOptions: {
    //     paths: "subset",
    //     matrixParams: "ignored",
    //     queryParams: "ignored",
    //     fragment: "ignored",
    //   }
    // },
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
        paths: "subset",
        matrixParams: "ignored",
        queryParams: "ignored",
        fragment: "ignored",
      },
      url: '/event',
    },
    // {
    //   icon: 'bi bi-person',
    //   translateKey: 'sidebar.private',
    //   routerLinkActiveOptions: {
    //     exact: true
    //   },
    //   items: [
    //     {
    //       translateKey: 'sidebar.profile',
    //       url: '/client/profile',
    //       icon: 'bi bi-person',
    //       routerLinkActiveOptions: {
    //         exact: true
    //       }
    //     },
    //     {
    //       translateKey: 'sidebar.settings',
    //       url: '/client/settings',
    //       icon: 'bi bi-gear',
    //       routerLinkActiveOptions: {
    //         exact: true
    //       }
    //     },
    //     {
    //       translateKey: 'sidebar.switch-business-client',
    //       url: '/identity/corridor',
    //       icon: 'bi bi-gear',
    //       routerLinkActiveOptions: {
    //         exact: true
    //       }
    //     },
    //   ]
    // }
  ];

  public async goToPublicPage(): Promise<void> {

    const clientId = await firstValueFrom(this.store.select(IdentityState.clientId));
    const link = `https://beeoclock.com/${clientId}`;
    console.log('Go to:', link);
    window.open(link, '_blank');

  }
}
