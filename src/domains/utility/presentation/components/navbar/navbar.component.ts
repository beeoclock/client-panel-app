import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {navbarTopDropShadow} from '@src/scripts/navbar-top';
import {searchInit} from '@src/scripts/search';
import {SearchComponent} from '@utility/presentation/components/search/search.component';
import {NotificationComponent} from '@utility/presentation/components/notification/notification.component';
import {ProfileComponent} from '@utility/presentation/components/profile/profile.component';
import {ToggleThemeComponent} from '@utility/presentation/components/toggle-theme/toggle-theme.component';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SearchComponent,
    NotificationComponent,
    ProfileComponent,
    ToggleThemeComponent,
    RouterLink
  ]
})
export class NavbarComponent implements AfterViewInit {

  @HostBinding()
  class = 'navbar navbar-light navbar-glass navbar-top navbar-expand';

  public ngAfterViewInit(): void {

    navbarTopDropShadow();
    searchInit();

  }

}
