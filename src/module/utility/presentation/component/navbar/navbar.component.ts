import {Component, inject, ViewEncapsulation} from '@angular/core';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {Store} from "@ngxs/store";
import {TranslateModule} from "@ngx-translate/core";
import {ProfileComponent} from "@utility/presentation/component/profile/profile.component";

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SearchComponent,
    NotificationComponent,
    RouterLink,
    TranslateModule,
    ProfileComponent
  ]
})
export class NavbarComponent {
  public readonly document = inject(DOCUMENT);
  public readonly store = inject(Store);

  public toggleSidebar(): void {
    this.document.getElementById('main-sidebar')?.classList?.toggle('translate-x-0')
  }
}
