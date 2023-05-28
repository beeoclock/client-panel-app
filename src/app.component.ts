import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum} from '@utility/domain/enum';

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
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

  }

}
