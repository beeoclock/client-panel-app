import {AfterViewInit, Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {navbarTopDropShadow} from '@src/scripts/navbar-top';
import {searchInit} from '@src/scripts/search';

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements AfterViewInit {

  @HostBinding()
  class = 'navbar navbar-light navbar-glass navbar-top navbar-expand';

  public ngAfterViewInit(): void {

    utils.docReady(navbarTopDropShadow);
    utils.docReady(searchInit);

  }

}
