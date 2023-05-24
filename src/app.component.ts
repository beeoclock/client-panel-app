import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {ModalComponent} from "@utility/presentation/component/modal/modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule, ModalComponent],
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
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }

  }

}
