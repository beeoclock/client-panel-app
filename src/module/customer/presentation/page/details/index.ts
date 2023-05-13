import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerRepository} from '@customer/repository/customer.repository';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {exhaustMap, Observable} from 'rxjs';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import * as Customer from '@customer/domain';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {PopoverComponent} from "@utility/presentation/component/popover/popover.component";

@Component({
  selector: 'customer-detail-page',
  template: `
    <ng-container *ngIf="customer$ | async as customer; else LoadingTemplate">
      <div class="d-flex justify-content-between">
        <utility-back-link-component url="../../"></utility-back-link-component>
        <utility-popover id="list-menu">
          <i button class="bi bi-three-dots-vertical"></i>
          <ul content class="list-group border-0">
            <li
              [routerLink]="['../../', 'form', customer._id]"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-pencil"></i>
              Edit
            </li>
            <li
              (click)="repository.delete(customer._id)"
              close-on-self-click
              class="list-group-item list-group-item-action cursor-pointer border-0">
              <i class="bi bi-trash"></i>
              Delete
            </li>
          </ul>
        </utility-popover>
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
    RouterLink,
    PopoverComponent
  ],
  standalone: true
})
export default class Index {

  public readonly repository = inject(CustomerRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly customer$: Observable<Customer.ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

}
