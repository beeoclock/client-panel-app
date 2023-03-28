import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/scripts/detector';
import {tooltipInit} from '@src/scripts/tooltip';
import {popoverInit} from '@src/scripts/popover';
import {toastInit} from '@src/scripts/toast';
import {formValidationInit} from '@src/scripts/form-validation';
import {cookieNoticeInit} from '@src/scripts/cookie-notice';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  template: `
    <router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  public ngAfterViewInit(): void {
    detectorInit();
    tooltipInit();
    popoverInit();
    toastInit();
    formValidationInit();
    cookieNoticeInit();
  }

}
