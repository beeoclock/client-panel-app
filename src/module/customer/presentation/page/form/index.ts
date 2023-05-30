import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CustomerForm} from '@customer/form/customer.form';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {CustomerRepository} from '@customer/repository/customer.repository';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {ICustomer} from "@customer/domain";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";

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

    HasErrorDirective,
    RouterLink,
    BackLinkComponent,
    HeaderCardComponent,
    InvalidTooltipDirective,
    TranslateModule
  ],
  standalone: true
})
export default class Index {

  // TODO move functions to store effects/actions

  public url = ['../'];

  private readonly router = inject(Router);
  private readonly repository = inject(CustomerRepository);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form = new CustomerForm();

  constructor() {
    this.activatedRoute.params.subscribe(({id}) => {
      if (id) {
        this.form.disable();
        this.form.markAsPending();
        this.url = ['../../', 'details', id];
        this.repository.item(id).then(({data}) => {
          if (data) {
            this.form.patchValue(data);
          }
          this.form.enable();
          this.form.updateValueAndValidity();
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
        .then(({data}) => {
          console.log(data);

          this.router.navigate(['../', 'details', data.id], {
            relativeTo: this.activatedRoute
          });
          // this.form.enable();
          // this.form.updateValueAndValidity();
          // if (!this.form.value._id) {
          //   this.form.reset();
          // }
        })
        .catch(() => {
          this.form.enable();
          this.form.updateValueAndValidity();
        });
    }
  }
}
