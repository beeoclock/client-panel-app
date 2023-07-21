import {Component, inject, ViewEncapsulation} from '@angular/core';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {IdentityState} from "@identity/state/identity/identity.state";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SearchComponent,
    NotificationComponent,
    RouterLink,
    TranslateModule
  ]
})
export class NavbarComponent {
  public readonly document = inject(DOCUMENT);
  public readonly store = inject(Store);

  public toggleSidebar(): void {
    this.document.getElementById('main-sidebar')?.classList?.toggle('translate-x-0')
  }

  public async goToPublicPage(): Promise<void> {

    const clientId = await firstValueFrom(this.store.select(IdentityState.clientId));
    window.open(`https://beeoclock.com/${clientId}`, '_blank');

  }
}
