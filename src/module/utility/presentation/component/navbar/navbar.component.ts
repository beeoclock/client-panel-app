import {Component, inject, ViewEncapsulation} from '@angular/core';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';
import {DOCUMENT} from "@angular/common";

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
export class NavbarComponent {
  public readonly document = inject(DOCUMENT);

  public toggleSidebar(): void {
    this.document.getElementById('main-sidebar')?.classList?.toggle('-translate-x-full')
  }
}
