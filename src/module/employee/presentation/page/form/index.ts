import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';

import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EmployeeForm} from '@employee/form/employee.form';
import {EmployeeRepository} from '@employee/repository/employee.repository';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IEmployee} from "@employee/domain";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'employee-form-page',
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
    InvalidTooltipDirective
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public readonly repository: EmployeeRepository = inject(EmployeeRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form: EmployeeForm = new EmployeeForm();

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
          this.form.updateValueAndValidity();
          this.form.enable();
        });
      }
    })
  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      this.repository.save(this.form.value as IEmployee)
        .then(() => {
          this.form.updateValueAndValidity();
          this.form.enable();
        })
        .catch(() => {
          this.form.updateValueAndValidity();
          this.form.enable();
        });
    }
  }
}
