import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CustomerFormService} from '@customer/service/customer.form.service';
import {ActivatedRoute} from '@angular/router';
import {ICustomer} from '@customer/interface/customer.interface';
import {CardComponent} from '@utility/presentation/components/card/card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'customer-detail-page',
  template: `
    <utility-card-component>
      <utility-body-card-component>
        <ul class="list-group" *ngIf="customer">
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
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    NgIf
  ],
  standalone: true
})
export default class Index implements OnInit {
  public readonly customerFormService: CustomerFormService = inject(CustomerFormService);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public customer: ICustomer | undefined;

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      this.customerFormService.item(id).then((customerDoc) => {
        this.customer = customerDoc.data();
      });
    });
  }
}
