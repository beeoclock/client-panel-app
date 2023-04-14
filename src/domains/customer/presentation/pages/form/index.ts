import {Component, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from '@customer/form/customer.form';
import {CardComponent} from '@utility/presentation/components/card/card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '@utility/presentation/components/input/input.component';
import {TextareaComponent} from '@utility/presentation/components/textarea/textarea.component';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';
import {InputErrorComponent} from '@utility/presentation/components/input-error/input-error.component';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';

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
    HasErrorModule
  ],
  standalone: true
})
export default class Index {
  public readonly form: CustomerForm = new CustomerForm();

  public save(): void {
    this.form.markAllAsTouched();
    console.log(this.form);
  }
}
