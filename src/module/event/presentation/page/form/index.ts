import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/form/event.form';
import {EventRepository} from '@event/repository/event.repository';
import {AttendeesComponent} from '@event/presentation/component/form/attendees/attendees.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IEvent} from "@event/domain";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {ServicesFormComponent} from "@event/presentation/component/form/services/services.form.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {LanguagePipe} from "@utility/pipes/language.pipe";
import {IService} from "@service/domain";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {ServiceComponent} from "@event/presentation/component/form/service/service.component";
import {
  ModalButtonInterface,
  ModalButtonRoleEnum,
  ModalComponent
} from '@src/module/utility/presentation/component/modal/modal.component';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";

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
    HeaderCardComponent,
    ServicesFormComponent,
    NgSelectModule,
    NgForOf,
    LanguagePipe,
    NgIf,
    DatePipe,
    InvalidTooltipDirective,
    TranslateModule,
    IonicModule,
  ],
  standalone: true
})
export default class Index {

  public url = ['../'];

  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly form = new EventForm();
  private readonly repository = inject(EventRepository);
  private readonly modalService = inject(ModalService);

  public duration = 0;

  @HostBinding()
  public readonly class = 'p-4 block';

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

    this.form.controls.start.valueChanges.subscribe((value: string) => {
      if (value) {
        const newValue = new Date(value);
        // TODO update end time
        this.form.controls.start.patchValue(newValue.toISOString(), {
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
    this.form.controls.services.value.forEach((service) => {
      if (value) {
        if (service.durationVersions[0].duration > this.duration) {
          this.duration = service.durationVersions[0].duration;
        }
      } else {
        this.duration += service.durationVersions[0].duration;
      }
    });

    this.calculateFinish();

  }

  public async save(): Promise<void> {

    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = structuredClone(this.form.value);
      this.form.disable();
      this.form.markAsPending();
      this.repository.save(value as IEvent)
        .then(({data}) => {
          console.log(data);

          this.router.navigate(['../', 'details', data.id], {
            relativeTo: this.activatedRoute
          });
          // this.form.enable();
          // this.form.updateValueAndValidity();
        })
        .catch(() => {
          this.form.enable();
          this.form.updateValueAndValidity();
        });
    }
  }

  public openServiceModal(service?: undefined | IService): void {

    const buttons: ModalButtonInterface[] = [
      {
        text: 'Cancel',
        classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
        role: ModalButtonRoleEnum.cancel,
        callback: (modal: ModalComponent) => {
          // options?.buttons?.cancel?.callback?.();
          modal.closeModal();
        }
      },
      {
        text: 'Confirm',
        classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList,
        role: ModalButtonRoleEnum.accept,
        enabledDebounceClick: true,
        callback: (modal: ModalComponent) => {
          // options?.buttons?.confirm?.callback?.();
          // modal.closeModal();
          const serviceComponent = modal.componentChildRefList[0].instance as unknown as ServiceComponent;
          serviceComponent.select();
        }
      }
    ];

    this.modalService.create([{
      component: ServiceComponent,
      data: {}
    }], {
      buttons,
      fixHeight: false,
      title: 'Add new service'
    }).then((modal) => {
      const serviceComponent = modal.instance.componentChildRefList[0].instance as unknown as ServiceComponent;
      if (service) {
        serviceComponent.setSelectedService(service);
      }
      serviceComponent.emitter.subscribe((event: IService) => {
        if (service) {
          this.form.controls.services.patchValue([...(this.form.controls.services.value ?? []).filter(({_id}) => _id !== service._id), event])
        } else {
          this.form.controls.services.patchValue([...(this.form.controls.services.value ?? []), event])
        }
        modal.instance.closeModal();
      });
      return modal;
    });
  }

  public removeServiceFromSelectedList(deleteIndex: number): void {
    this.form.controls.services.patchValue(this.form.controls.services.value.filter(((_, index) => index !== deleteIndex)));
  }

  public editServiceFromSelectedList(service: IService): void {
    this.openServiceModal(service);
  }

}
