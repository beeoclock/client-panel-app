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
    if (this.translateService.getDefaultLang() in LanguageCodeEnum) {
      this.translateService.setDefaultLang(this.translateService.getDefaultLang());
    } else {
      this.translateService.setDefaultLang(LanguageCodeEnum.en);
    }
  }

  public ngAfterViewInit(): void {
    detectorInit();

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

  }

}
