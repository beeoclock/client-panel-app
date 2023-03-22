import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: true,
  selector: 'utility-sidebar-component',
  templateUrl: 'sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'navbar navbar-light navbar-vertical navbar-expand-xl'
  }
})
export default class SidebarComponent {

}
