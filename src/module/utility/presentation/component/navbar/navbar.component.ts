import {AfterViewInit, Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {SearchComponent} from '@utility/presentation/component/search/search.component';
import {NotificationComponent} from '@utility/presentation/component/notification/notification.component';
import {RouterLink} from '@angular/router';
import {Auth} from "@angular/fire/auth";
import {Tooltip} from "bootstrap";
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
export class NavbarComponent implements AfterViewInit {

  public readonly auth = inject(Auth);
  public readonly document = inject(DOCUMENT);
  public tooltipList: Tooltip[] = [];

  @HostBinding()
  class = 'navbar navbar-light navbar-glass navbar-top navbar-expand';

  public ngAfterViewInit(): void {

    this.document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
      this.tooltipList.push(new Tooltip(element));
    });

  }

}
