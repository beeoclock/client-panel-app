import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {navbarTopDropShadow} from '@src/scripts/navbar-top';
import {searchInit} from '@src/scripts/search';

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'navbar navbar-light navbar-glass navbar-top navbar-expand'
  }
})
export class NavbarComponent implements AfterViewInit {

  public ngAfterViewInit(): void {

    utils.docReady(navbarTopDropShadow);
    utils.docReady(searchInit);

  }

}
