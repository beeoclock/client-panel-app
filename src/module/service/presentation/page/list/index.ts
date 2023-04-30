import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ServiceFormRepository} from '@service/repository/service.form.repository';
import {FilterComponent} from '@service/presentation/component/filter/filter.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {ILanguageVersion} from '@service/domain';
import {Functions, httpsCallableData} from '@angular/fire/functions';

@Component({
  selector: 'service-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    RouterLink,
    ButtonComponent,
    TableComponent,
    HeaderTableComponent,
    BodyTableComponent,
    PaginationComponent,
    NgForOf,
    DatePipe,
    FilterComponent,
    AsyncPipe,
    NgIf,
    SpinnerComponent
  ],
  providers: [
    ServiceFormRepository
  ],
  standalone: true
})
export default class Index implements OnInit {
  public readonly repository = inject(ServiceFormRepository);
  public readonly translateService = inject(TranslateService);
  public readonly functions = inject(Functions);

  constructor() {
    this.repository.init();
  }

  public ngOnInit() {
    const serviceListGet = httpsCallableData(this.functions, 'serviceListGet', {

    });
    serviceListGet().subscribe((data) => {
      console.log(data);
    });
  }

  public get currentLanguageCode(): LanguageCodeEnum {
    return this.translateService.getDefaultLang() as LanguageCodeEnum;
  }

  public getFirstLanguageCode(languageVersions: {[key in keyof typeof LanguageCodeEnum]?: ILanguageVersion} = {}): LanguageCodeEnum {
    if (this.currentLanguageCode in languageVersions) {
      return this.currentLanguageCode;
    }
    return Object.keys(languageVersions)[0] as LanguageCodeEnum;
  }

  public getLanguageCodes(languageVersions: {[key in keyof typeof LanguageCodeEnum]?: ILanguageVersion} = {}): string {
    return Object.keys(languageVersions).map(code => LANGUAGES.find(language => language.code === code)?.name ?? '').join(', ');
  }
}
