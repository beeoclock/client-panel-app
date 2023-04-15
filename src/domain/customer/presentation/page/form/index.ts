import {Component, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from '@customer/form/customer.form';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputComponent} from '@utility/presentation/component/input/input.component';
import {TextareaComponent} from '@utility/presentation/component/textarea/textarea.component';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';

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
  public readonly form: CustomerForm = new CustomerForm();
}
