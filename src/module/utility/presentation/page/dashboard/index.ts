import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'utility-dashboard-page',
    templateUrl: 'index.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterLink
    ]
})
export default class Index implements OnInit {

  private readonly auth: Auth = inject(Auth);

  public ngOnInit(): void {
    this.auth.onAuthStateChanged((result) => {
      console.log(result);
    });
  }

}
