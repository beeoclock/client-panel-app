import {Component, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {EventActions} from "@event/state/event/event.actions";
import {IEvent} from "@event/domain";
import {ITableState} from "@utility/domain/table.state";
import {
  TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {EventState} from "@event/state/event/event.state";

@Component({
  selector: 'event-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent,
    CardComponent,
    BodyCardComponent,
    RouterLink,
    DeleteButtonComponent,
    TableComponent,
    HeaderTableComponent,
    BodyTableComponent,
    PaginationComponent,
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
    TableStatePaginationComponent
  ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = EventActions;

  @Select(EventState.tableState)
  public readonly tableState$!: Observable<ITableState<IEvent>>;
}
