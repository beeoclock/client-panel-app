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
import {ServiceFormRepository} from '@service/repository/service.form.repository';
import {FilterComponent} from '@service/presentation/component/filter/filter.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';

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
export default class Index {
  public readonly repository = inject(ServiceFormRepository);

  constructor() {
    this.repository.init();
  }
}
