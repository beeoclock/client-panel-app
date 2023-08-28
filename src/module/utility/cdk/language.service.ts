import {inject, Injectable, LOCALE_ID} from "@angular/core";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class LanguageService {

  private readonly translateService = inject(TranslateService);
  private readonly localId = inject(LOCALE_ID);

  public initialize(): void {


    // const locationInitialized: Promise<any> = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    // locationInitialized.then(() => {
    //
    //   let languageCode: string = LocalStorageTool.get(LocalStorageConst.COMMON.LANGUAGE_CODE, false);
    //
    //   translateService.addLangs(Object.values(LanguageCodeEnum));
    //   if (is.null.or.undefined(languageCode)) {
    //     languageCode = LanguageCodeEnum.pl; // TODO add default language to env.js
    //     LocalStorageTool.set(LocalStorageConst.COMMON.LANGUAGE_CODE, languageCode, false);
    //   }
    //   translateService.setDefaultLang(LanguageCodeEnum.pl);
    //   translateService.use(languageCode);
    //   translateService.onLangChange.subscribe((result: DefaultLangChangeEvent) => {
    //     LocalStorageTool.set(LocalStorageConst.COMMON.LANGUAGE_CODE, result.lang);
    //   });
    // });

    // const LOCALE = navigator.languages
    //   ? navigator.languages[0]
    //   : (navigator.language || (navigator as any).userLanguage);

    // I18n
    const browserLanguage = this.translateService.getBrowserLang();
    const selectedLanguageCode = localStorage.getItem('language');
    if (selectedLanguageCode) {
      this.translateService.use(selectedLanguageCode);
    } else {
      if (browserLanguage && browserLanguage in LanguageCodeEnum) {
        this.translateService.use(browserLanguage);
      } else {
        this.translateService.use(this.translateService.getDefaultLang());
      }
    }

    this.translateService.onLangChange.subscribe((language) => {
      localStorage.setItem('language', language.lang);
    });

  }

}
