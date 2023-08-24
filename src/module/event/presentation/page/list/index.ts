import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
import {
  TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {EventState} from "@event/state/event/event.state";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date.pipe";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";

@Component({
  selector: 'event-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DeleteButtonComponent,
    TableComponent,
    HeaderTableComponent,
    BodyTableComponent,
    NgForOf,
    DatePipe,
    AsyncPipe,
    FilterComponent,
    DropdownComponent,
    NgIf,
    SortIndicatorComponent,
    LoaderComponent,
    ActionComponent,
    TranslateModule,
    TableStatePaginationComponent,
    DynamicDatePipe,
    CurrencyPipe,
    EventStatusStyleDirective
  ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = EventActions;

  @Select(EventState.tableState)
  public readonly tableState$!: Observable<ITableState<IEvent>>;

  public readonly translateService = inject(TranslateService);

  public formatDuration(duration: string): string {

    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});

  }

}
