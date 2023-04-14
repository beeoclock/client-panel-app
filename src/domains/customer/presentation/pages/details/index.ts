import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerFormService} from '@customer/service/customer.form.service';
import {ActivatedRoute} from '@angular/router';
import {ICustomer} from '@customer/interface/customer.interface';
import {CardComponent} from '@utility/presentation/components/card/card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {SpinnerComponent} from '@utility/presentation/components/spinner/spinner.component';

@Component({
  selector: 'customer-detail-page',
  template: `
    <utility-card-component>
      <utility-body-card-component>
        <ul class="list-group" *ngIf="customer$ | async as customer; else LoadingTemplate">
          <li class="list-group-item">
            <strong>First name:</strong>
            <p class="m-0">{{ customer.firstName }}</p>
          </li>
          <li class="list-group-item">
            <strong>Last name:</strong>
            <p class="m-0">{{ customer.lastName }}</p>
          </li>
          <li class="list-group-item">
            <strong>E-mail:</strong>
            <p class="m-0">{{ customer.email }}</p>
          </li>
          <li class="list-group-item">
            <strong>Phone:</strong>
            <p class="m-0">{{ customer.phone }}</p>
          </li>
          <li class="list-group-item">
            <strong>Note:</strong>
            <p class="m-0">{{ customer.note }}</p>
          </li>
        </ul>
      </utility-body-card-component>
    </utility-card-component>
    <ng-template #LoadingTemplate>
      <div spinner></div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    NgIf,
    AsyncPipe,
    SpinnerComponent
  ],
  standalone: true
})
export default class Index {
  public readonly customerFormService: CustomerFormService = inject(CustomerFormService);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly customer$: Observable<ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      const customerDoc = await this.customerFormService.item(id);
      return customerDoc.data();
    }),
  );

}
