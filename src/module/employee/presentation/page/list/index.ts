import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ListPage} from "@utility/list.page";
import {EmployeeRepository} from "@employee/repository/employee.repository";
import {FilterComponent} from "@employee/presentation/component/filter/filter.component";
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";

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
    PopoverComponent,
    NgIf,
    SortIndicatorComponent
  ],
  standalone: true
})
export default class Index extends ListPage {
  public override readonly repository = inject(EmployeeRepository);
}
