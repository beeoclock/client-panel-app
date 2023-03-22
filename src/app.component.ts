import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/scripts/detector';
import {utils} from '@src/scripts/utls';
import {tooltipInit} from '@src/scripts/tooltip';
import {popoverInit} from '@src/scripts/popover';
import {toastInit} from '@src/scripts/toast';
import {formValidationInit} from '@src/scripts/form-validation';
import {cookieNoticeInit} from '@src/scripts/cookie-notice';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  public ngAfterViewInit(): void {
    utils.docReady(detectorInit);
    utils.docReady(tooltipInit);
    utils.docReady(popoverInit);
    utils.docReady(toastInit);
    utils.docReady(formValidationInit);
    utils.docReady(cookieNoticeInit);
  }

}
