import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FilterComponent} from '@service/presentation/component/filter/filter.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageCodeEnum, LANGUAGES} from '@utility/domain/enum';
import {ILanguageVersion, IService} from '@service/domain';
import {ListPage} from "@utility/list.page";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {ServiceState} from "@service/state/service/service.state";
import {ITableState} from "@utility/domain/table.state";
import {
  TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {ActiveStyleDirective} from "@utility/directives/active-style/active-style.directive";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";

@Component({
  selector: 'service-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CardComponent,
        BodyCardComponent,
        RouterLink,
        DeleteButtonComponent,
        TableComponent,
        HeaderTableComponent,
        BodyTableComponent,
        NgForOf,
        DatePipe,
        FilterComponent,
        AsyncPipe,
        NgIf,
        SpinnerComponent,
        DropdownComponent,
        SortIndicatorComponent,
        LoaderComponent,
        ActionComponent,
        TranslateModule,
        TableStatePaginationComponent,
        NgClass,
        ActiveStyleDirective,
        DynamicDatePipe
    ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = ServiceActions;

  @Select(ServiceState.tableState)
  public readonly tableState$!: Observable<ITableState<IService>>;
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
