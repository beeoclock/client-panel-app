import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ActivatedRoute} from '@angular/router';
import {ServiceRepository} from '@service/repository/service.repository';
import {ServiceForm} from '@service/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {DurationsFormComponent} from '@service/presentation/component/form/duration/durations.form.component';
import {ServicesFormComponent} from '@service/presentation/component/form/service/services.form.component';
import {SchedulesFormComponent} from '@service/presentation/component/form/schedules.form.component';
import {IService} from "@service/domain";
import {ButtonComponent} from "@utility/presentation/component/button/button.component";

@Component({
  selector: 'employee-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    ReactiveFormsModule,
    BackLinkComponent,
    DurationsFormComponent,
    ServicesFormComponent,
    SchedulesFormComponent,
    ButtonComponent,
  ],
  providers: [
    ServiceRepository,
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public readonly repository = inject(ServiceRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = new ServiceForm();

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
    });
  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      this.repository.save(this.form.value as IService)
        .then((result) => {
          this.form.enable();
          this.form.updateValueAndValidity();
          this.form.reset();
        })
        .catch((error) => {
          this.form.enable();
          this.form.updateValueAndValidity();
        });
    }
  }
}
