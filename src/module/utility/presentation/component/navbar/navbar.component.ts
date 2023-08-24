import {Component, inject, ViewEncapsulation} from '@angular/core';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {ProfileComponent} from "@utility/presentation/component/profile/profile.component";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";

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
  public readonly sidebarService = inject(SidebarService);
}
