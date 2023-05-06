import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from '@customer/form/customer.form';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {CustomerRepository} from '@customer/repository/customer.repository';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {ICustomer} from "@customer/domain";

@Component({
  selector: 'customer-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    ReactiveFormsModule,
    InputDirective,
    TextareaDirective,
    ButtonComponent,
    InputErrorComponent,
    HasErrorDirective,
    RouterLink,
    BackLinkComponent
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  private readonly repository = inject(CustomerRepository);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form = new CustomerForm();

  constructor() {
    this.activatedRoute.params.subscribe(({id}) => {
      if (id) {
        this.url = ['../../', 'details', id];
        this.repository.item(id).then(({data}) => {
          if (data) {
            this.form.patchValue(data);
          }
        });
      }
    })
  }

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      this.repository.save(this.form.value as ICustomer)
        .then(() => {
          this.form.enable();
          this.form.updateValueAndValidity();
        })
        .catch(() => {
          this.form.enable();
          this.form.updateValueAndValidity();
        });
    }
  }
}
