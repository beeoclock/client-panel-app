import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from '@customer/form/customer.form';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '@utility/presentation/component/input/input.component';
import {TextareaComponent} from '@utility/presentation/component/textarea/textarea.component';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {CustomerFormRepository} from '@customer/repository/customer.form.repository';

@Component({
  selector: 'customer-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
    InputErrorComponent,
    HasErrorModule,
    RouterLink,
    BackLinkComponent
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public customerId: string | undefined;

  public readonly customerFormAdapt: CustomerFormRepository = inject(CustomerFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form: CustomerForm = new CustomerForm();

  constructor() {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.customerId = id;
      this.url = ['../../', 'details', id];
      this.form.controls.id.patchValue(id);
      this.customerFormAdapt.item(id).then((customerDoc) => {
        const customer = customerDoc.data();
        if (customer) {
          this.form.patchValue(customer);
        }
      });
    })
  }
}
