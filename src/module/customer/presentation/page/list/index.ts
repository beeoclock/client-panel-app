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
import {Pagination} from "@utility/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";

@Component({
  selector: 'customer-list-page',
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
    FilterComponent,
    DropdownComponent,
    DatePipe,
    NgIf,
    SortIndicatorComponent,
    LoaderComponent,
    ActionComponent,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true
})
export default class Index extends ListPage {

  public override readonly actions = CustomerActions;

  @Select(CustomerState.listLoading)
  public readonly loading$!: Observable<boolean>;

  @Select(CustomerState.listPagination)
  public readonly pagination$!: Observable<Pagination<ICustomer>>;

  @Select(CustomerState.listItems)
  public readonly items$!: Observable<ICustomer[]>;

}
