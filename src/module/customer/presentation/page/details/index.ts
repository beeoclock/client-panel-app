import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerRepository} from '@customer/repository/customer.repository';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
        <button class="btn btn-danger" (click)="delete(customer._id)">
          <i class="bi bi-trash"></i>
          Delete
        </button>
        <a class="btn btn-primary" [routerLink]="['../../', 'form', customer._id]">
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

  public readonly repository = inject(CustomerRepository);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly customer$: Observable<Customer.ICustomer | undefined> = this.activatedRoute.params.pipe(
    exhaustMap(async ({id}) => {
      return (await this.repository.item(id)).data;
    }),
  );

  public delete(id: string): void {
    this.repository.remove(id).then(() => {
      this.router.navigate(['/', 'customer']);
    });
  }

}
