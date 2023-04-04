import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {detectorInit} from '@src/scripts/detector';
import {formValidationInit} from '@src/scripts/form-validation';
import {TranslateModule} from '@ngx-translate/core';
import {Auth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  template: `
    <router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);

  public ngAfterViewInit(): void {
    this.auth.onAuthStateChanged((user) => {
      const path = ['/', 'identity'];
      if (user) {
        path[1] = 'dashboard';
      }
      this.router.navigate(path);
    });
    detectorInit();
    formValidationInit();
  }

}
