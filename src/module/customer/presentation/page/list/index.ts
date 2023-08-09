import {Component, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Observable} from "rxjs";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ITableState} from "@utility/domain/table.state";
import {
  TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/pipes/dynamic-date.pipe";
import {ActiveStyleDirective} from "@utility/directives/active-style/active-style.directive";

@Component({
  selector: 'customer-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
    imports: [
        CardComponent,
        BodyCardComponent,
        RouterLink,
        DeleteButtonComponent,
        TableComponent,
        HeaderTableComponent,
        BodyTableComponent,
        NgForOf,
        FilterComponent,
        DropdownComponent,
        DatePipe,
        NgIf,
        SortIndicatorComponent,
        LoaderComponent,
        ActionComponent,
        TranslateModule,
        AsyncPipe,
        TableStatePaginationComponent,
        DynamicDatePipe,
        ActiveStyleDirective,
    ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = CustomerActions;

  @Select(CustomerState.tableState)
  public readonly tableState$!: Observable<ITableState<ICustomer>>;

}
