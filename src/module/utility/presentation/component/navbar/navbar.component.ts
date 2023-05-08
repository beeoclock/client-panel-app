import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {navbarTopDropShadow} from '@src/script/navbar-top';
import {searchInit} from '@src/script/search';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SearchComponent,
    NotificationComponent,
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
