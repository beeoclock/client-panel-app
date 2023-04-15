import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/components/table/example.table.component';
import {CardComponent} from '@utility/presentation/components/card/card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';
import {CustomerFormAdapt} from '@customer/network/adapt/customer.form.adapt';
import {TableComponent} from '@utility/presentation/components/table/table.component';
import {HeaderTableComponent} from '@utility/presentation/components/table/header.table.component';
import {BodyTableComponent} from '@utility/presentation/components/table/body.table.component';
import {PaginationComponent} from '@utility/presentation/components/pagination/pagination.component';
import {NgForOf} from '@angular/common';
import {ICustomer} from '@customer/interface/customer.interface';
import {QueryDocumentSnapshot} from '@angular/fire/compat/firestore';

@Component({
  selector: 'customer-settings-page',
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
    NgForOf
  ],
  standalone: true
})
export default class Index {
  public readonly customerFormAdapt: CustomerFormAdapt = inject(CustomerFormAdapt);

  public list: QueryDocumentSnapshot<ICustomer>[] = [];

  constructor() {
    this.customerFormAdapt.list().then((list) => {
      this.list = list.docs;
    });
  }
}
