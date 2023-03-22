import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: true,
  selector: 'utility-navbar-component',
  templateUrl: 'navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'navbar navbar-light navbar-glass navbar-top navbar-expand'
  }
})
export default class NavbarComponent {

}
