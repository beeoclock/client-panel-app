import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EmployeeForm} from '@employee/form/employee.form';
import {Notification} from '@utility/notification';
import {EmployeeFormRepository} from '@employee/repository/employee.form.repository';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

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
    InputErrorComponent,
    HasErrorDirective,
    RouterLink,
    BackLinkComponent
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public docId: string | undefined;

  public readonly repository: EmployeeFormRepository = inject(EmployeeFormRepository);
  public readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form: EmployeeForm = new EmployeeForm();

  constructor() {
    this.activatedRoute.params.subscribe(({id}) => {
      if (id) {
        this.docId = id;
        this.url = ['../../', 'details', id];
        this.form.controls.id.patchValue(id);
        this.repository.item(id).then((docRef) => {
          const doc = docRef.data();
          if (doc) {
            this.form.patchValue(doc);
          }
        });
      }
    })
  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      const {id, ...value} = this.form.value;
      await this.repository.save(value, id);
      Notification.push({
        message: 'success'
      });
    }
  }
}
