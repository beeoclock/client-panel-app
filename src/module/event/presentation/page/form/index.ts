import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/form/event.form';
import {EventFormRepository} from '@event/repository/event.form.repository';
import {NgSelectModule} from '@ng-select/ng-select';
import {AttendeesComponent} from '@event/presentation/component/attendees/attendees.component';
import {FlatpickrModule} from 'angularx-flatpickr';
import {is} from 'thiis';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {LANGUAGES} from '@utility/domain/enum';
import {IEvent} from "@event/domain";

@Component({
  selector: 'event-form-page',
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
    BackLinkComponent,
    NgSelectModule,
    FormsModule,
    AttendeesComponent,
    FlatpickrModule
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly form: EventForm = new EventForm();
  private readonly repository: EventFormRepository = inject(EventFormRepository);

  public readonly languageList = LANGUAGES;

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
    });

    this.form.controls.start.valueChanges.subscribe((value: string | Date) => {
      if (is.Date(value)) {
        this.form.controls.start.patchValue(value.toISOString(), {
          onlySelf: false,
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: false,
        });
      }
    });

    this.form.controls.end.valueChanges.subscribe((value: string | Date) => {
      if (is.Date(value)) {
        this.form.controls.end.patchValue(value.toISOString(), {
          onlySelf: false,
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: false,
        });
      }
    });

  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      await this.repository.save(this.form.value as IEvent);
    }
  }
}
