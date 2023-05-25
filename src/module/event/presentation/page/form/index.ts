import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/form/event.form';
import {EventRepository} from '@event/repository/event.repository';
import {AttendeesComponent} from '@event/presentation/component/form/attendees/attendees.component';
import {FlatpickrModule} from 'angularx-flatpickr';
import {is} from 'thiis';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IEvent} from "@event/domain";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {ServicesFormComponent} from "@event/presentation/component/form/services/services.form.component";
import {InputErrorComponent} from "@utility/presentation/component/input-error/input-error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {IService} from "@service/domain";

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
    HasErrorDirective,
    RouterLink,
    BackLinkComponent,
    FormsModule,
    AttendeesComponent,
    FlatpickrModule,
    HeaderCardComponent,
    ServicesFormComponent,
    InputErrorComponent,
    NgSelectModule,
    NgForOf,
    LanguagePipe,
    NgIf,
    DatePipe
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public readonly activatedRoute = inject(ActivatedRoute);

  public readonly form = new EventForm();
  private readonly repository = inject(EventRepository);

  public duration: number = 0;

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

    this.form.controls.start.valueChanges.subscribe((value: string | Date) => {
      if (is.Date(value)) {
        // TODO update end time
        this.form.controls.start.patchValue(value.toISOString(), {
          onlySelf: false,
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: false,
        });
        this.calculateFinish();
      }
    });

    this.form.controls.services.valueChanges.subscribe(() => {
      this.calculateDuration();
    });

    this.form.controls.servicesAreProvidedInParallel.valueChanges.subscribe(() => {
      this.calculateDuration();
    });

  }

  private calculateFinish(): void {

    const start = new Date(this.form.controls.start.value);
    start.setMinutes(start.getMinutes() + this.duration);
    this.form.controls.end.patchValue(start.toISOString(), {
      onlySelf: true,
      emitEvent: false,
    });

  }

  private calculateDuration(): void {

    const value = this.form.controls.servicesAreProvidedInParallel.value;

    this.duration = 0;
    if (value) {
      this.form.controls.services.value.forEach((service) => {
        if (service.durationVersions[0].duration > this.duration) {
          this.duration = service.durationVersions[0].duration;
        }
      });
    } else {
      this.form.controls.services.value.forEach((service) => {
        this.duration += service.durationVersions[0].duration;
      })
    }

    this.calculateFinish();

  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = structuredClone(this.form.value);
      this.form.disable();
      this.form.markAsPending();
      this.repository.save(value as IEvent)
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

  public openServiceModal(service?: undefined | IService): void {
    // this.modalService.create([{
    //   component: ServiceComponent,
    //   data: {}
    // }], {
    //   buttons: [],
    //   fixHeight: false,
    //   title: 'Add new service'
    // }).then((modal) => {
    //   const serviceComponent = modal.instance.componentChildRefList[0].instance as unknown as ServiceComponent;
    //   if (service) {
    //     serviceComponent.setSelectedService(service);
    //   }
    //   serviceComponent.emitter.subscribe((event: IService) => {
    //     if (service) {
    //       this.form.controls.services.patchValue([...(this.form.controls.services.value ?? []).filter(({_id}) => _id !== service._id), event])
    //     } else {
    //       this.form.controls.services.patchValue([...(this.form.controls.services.value ?? []), event])
    //     }
    // modal.instance.closeModal();
    // });
    //   return modal;
    // });
  }

  public removeServiceFromSelectedList(service: IService): void {
    this.form.controls.services.patchValue(this.form.controls.services.value.filter((({_id}) => _id !== service._id)));
  }

  public editServiceFromSelectedList(service: IService): void {
    this.openServiceModal(service);
  }

}
