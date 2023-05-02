import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {TableComponent} from '@utility/presentation/component/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/component/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/component/pagination/pagination.component';
import {DatePipe, NgForOf} from '@angular/common';
import * as Employee from '@employee/domain';
import {EmployeeRepository} from '@employee/repository/employee.repository';

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
    DatePipe
  ],
  standalone: true
})
export default class Index implements OnInit {
  public readonly repository = inject(EmployeeRepository);

  public list: Employee.IEmployee[] = [];

  public ngOnInit() {
    this.repository.list(
      10,
      1,
      'createdAt',
      'asc',
      {}
    ).then((result) => {
      const {items, total} = result.data;
      this.list = items;
    })
  }
}
