import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ServiceRepository} from '@service/repository/service.repository';
import {FilterComponent} from '@service/presentation/component/filter/filter.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {ILanguageVersion} from '@service/domain';
import {ListPage} from "@utility/list.page";
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

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
        SpinnerComponent,
        PopoverComponent,
        SortIndicatorComponent,
        LoaderComponent
    ],
  providers: [
    ServiceRepository
  ],
  standalone: true
})
export default class Index extends ListPage {
  public override readonly repository = inject(ServiceRepository);
  public readonly translateService = inject(TranslateService);

  public get currentLanguageCode(): LanguageCodeEnum {
    return this.translateService.getDefaultLang() as LanguageCodeEnum;
  }

  public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
    const firstOption = languageVersions.find(({language}) => language === this.currentLanguageCode);
    return firstOption ?? languageVersions[0];
  }

  public getLanguageCodes(languageVersions: ILanguageVersion[] = []): string {
    return languageVersions.map(({language}) => LANGUAGES.find(({code}) => code === language)?.name ?? '').join(', ');
  }

}
