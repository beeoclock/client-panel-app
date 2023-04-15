import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerFormRepository} from '@customer/repository/customer.form.repository';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {ICustomer} from '@customer/interface/customer.interface';

@Component({
  selector: 'customer-detail-page',
  template: `
    <utility-back-link-component url="../../"></utility-back-link-component>
    <utility-card-component class="mt-3">
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
    SpinnerComponent,
    BackLinkComponent,
    BodyCardComponent,
    BackLinkComponent
  ],
  standalone: true
})
export default class Index {
  public readonly customerFormAdapt: CustomerFormRepository = inject(CustomerFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly customer$: Observable<ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      const customerDoc = await this.customerFormAdapt.item(id);
      return customerDoc.data();
    }),
  );

}
