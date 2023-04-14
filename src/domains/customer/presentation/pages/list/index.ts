import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/components/table/example.table.component';
import {CardComponent} from '@utility/presentation/components/card/card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {RouterLink} from '@angular/router';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';
import {CustomerFormService} from '@customer/service/customer.form.service';

@Component({
  selector: 'customer-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent,
    CardComponent,
    BodyCardComponent,
    RouterLink,
    ButtonComponent
  ],
  standalone: true
})
export default class Index {
  public readonly customer: CustomerFormService = inject(CustomerFormService);

  constructor() {
    this.customer.list().then((list) => {
      console.log(list);
    });
  }
}
