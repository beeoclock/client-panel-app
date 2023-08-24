import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {TranslateModule} from '@ngx-translate/core';
import {Store} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {DOCUMENT} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {NgEventBus} from 'ng-event-bus';
import {LanguageService} from "@utility/cdk/language.service";
import {filter} from "rxjs";
import {is} from "thiis";
import {SplashScreenService} from "@utility/cdk/splash-screen.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, TranslateModule, IonicModule],
  providers: [NgEventBus],
  template: `
    <router-outlet></router-outlet>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  private readonly store = inject(Store);
  private readonly languageService = inject(LanguageService);
  private readonly splashScreenService = inject(SplashScreenService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.languageService.initialize();
  }

  public ngAfterViewInit(): void {
    const html = this.document.querySelector('html');
    if (html) {
      detectorInit(html);
    }

    this.store.select(AppState.pageLoading)
      .pipe(
        filter(is.false)
      )
      .subscribe(() => {
        this.splashScreenService.hide();
      });

  }

}
