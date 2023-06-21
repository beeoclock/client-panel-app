import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {Store} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  template: `
    <router-outlet></router-outlet>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  private readonly translateService = inject(TranslateService);
  private readonly store = inject(Store);
  private readonly document = inject(DOCUMENT);

  constructor() {
    const browserLanguage = this.translateService.getBrowserLang();
    if (browserLanguage && browserLanguage in LanguageCodeEnum) {
      this.translateService.use(browserLanguage);
    } else {
      this.translateService.use(this.translateService.getDefaultLang());
    }
  }

  public ngAfterViewInit(): void {
    detectorInit();

    if (localStorage.getItem('theme') === 'dark') {
      this.document.documentElement.classList.add('dark');
      this.document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

    this.store.select(AppState.pageLoading).subscribe((result) => {
      console.log(result);
      if (result === false) { // Don't change on !result because undefined is also false case for the expression!
        this.hideLoaderApp();
      }
    });

  }

  private hideLoaderApp(): void {

    setTimeout(() => {
      this.document.body.style.setProperty('--custom-opacity', '0');
      this.document.body.style.setProperty('--custom-visibility', 'hidden');
    }, 500);

  }

}
