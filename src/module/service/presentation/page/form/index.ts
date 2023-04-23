import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {ActivatedRoute} from '@angular/router';
import {Notification} from '@utility/notification';
import {ServiceFormRepository} from '@service/repository/service.form.repository';
import {ServiceForm} from '@service/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {DurationsFormComponent} from '@service/presentation/component/form/durations.form.component';
import {ServicesFormComponent} from '@service/presentation/component/form/services.form.component';
import {SchedulesFormComponent} from '@service/presentation/component/form/schedules.form.component';

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
  ],
  providers: [
    ServiceFormRepository,
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public docId: string | undefined;

  public readonly repository = inject(ServiceFormRepository);
  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = new ServiceForm();

  constructor() {
    this.activatedRoute.params.subscribe(({id}) => {
      if (id) {
        this.docId = id;
        this.url = ['../../', 'details', id];
        this.form.controls.id.patchValue(id);
        this.repository.item(id).then((docRef) => {
          const data = docRef.data();
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
      const {id, ...value} = this.form.value;
      await this.repository.save(value, id);
      Notification.push(new Notification('success'));
    }
  }
}
