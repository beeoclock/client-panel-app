import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerFormRepository} from '@customer/repository/customer.form.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Customer from '@customer/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

@Component({
  selector: 'customer-detail-page',
  template: `
    <ng-container *ngIf="customer$ | async as customer; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <a class="btn btn-primary" [routerLink]="['../../', 'form', customerId]">
          <i class="bi bi-pencil-fill me-3"></i>
          Edit
        </a>
      </div>
      <utility-card-component class="mt-3">
        <utility-body-card-component>
          <ul class="list-group">
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
    </ng-container>
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
    BackLinkComponent,
    ButtonComponent,
    RouterLink
  ],
  standalone: true
})
export default class Index {
  public customerId!: string;

  public readonly customerFormAdapt: CustomerFormRepository = inject(CustomerFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly customer$: Observable<Customer.Interface.ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      this.customerId = id;
      const customerDoc = await this.customerFormAdapt.item(this.customerId);
      return customerDoc.data();
    }),
  );

}
