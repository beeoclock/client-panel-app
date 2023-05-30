import {Component, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {FilterComponent} from "@employee/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {Pagination} from "@utility/domain";
import {ICustomer} from "@customer/domain";
import {EmployeeActions} from "@employee/state/employee/employee.actions";
import {EmployeeState} from "@employee/state/employee/employee.state";

@Component({
  selector: 'employee-list-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent,
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
    DropdownComponent,
    NgIf,
    SortIndicatorComponent,
    LoaderComponent,
    ActionComponent,
    TranslateModule,
    AsyncPipe
  ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = EmployeeActions;

  @Select(EmployeeState.listLoading)
  public readonly loading$!: Observable<boolean>;

  @Select(EmployeeState.listPagination)
  public readonly pagination$!: Observable<Pagination<ICustomer>>;

  @Select(EmployeeState.listItems)
  public readonly items$!: Observable<ICustomer[]>;

}
