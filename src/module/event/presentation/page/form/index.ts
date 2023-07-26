import {Component, HostBinding, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {EventForm} from '@event/form/event.form';
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
import {filter, firstValueFrom, Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {EventActions} from "@event/state/event/event.actions";
import {Duration} from "luxon";
import {ConvertTime} from "@utility/domain/convert.time";
import humanizeDuration from "humanize-duration";
import {IMember} from "@member/domain";
import calculateDuration = ConvertTime.calculateDuration;

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
export default class Index implements OnInit {

  // TODO move functions to store effects/actions

  public readonly baseUrl = '/event';
  public readonly cancelUrl = [this.baseUrl];

  private readonly store = inject(Store);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly router = inject(Router);

  public readonly form = new EventForm();
  private readonly modalService = inject(ModalService);

  @Select(EventState.itemData)
  public itemData$!: Observable<IEvent | undefined>;

  public duration = '';
  public durationInMilliseconds = 0;

  @HostBinding()
  public readonly class = 'p-4 block';

  public getPermanentMembers(permanentMembers: IMember[]): string {
    const firstMember = permanentMembers[0];
    if (firstMember) {
      if (firstMember.firstName && firstMember.lastName) {
        return `${firstMember.firstName} ${firstMember.lastName}`;
      }
      return firstMember.email;
    }
    return '';
  }

  public ngOnInit(): void {

    this.detectItem();

    this.form.valueChanges.subscribe(() => {
      this.calculateDuration();
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

    // this.form.controls.services.valueChanges.subscribe(() => {
    //   this.calculateDuration();
    // });
    //
    // this.form.controls.servicesAreProvidedInParallel.valueChanges.subscribe(() => {
    //   this.calculateDuration();
    // });
  }

  public detectItem(): void {
    firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
      firstValueFrom(this.itemData$).then((result) => {
        if (result?._id) {
          this.cancelUrl.push('details', result._id);
          console.log(result);
          this.form.patchValue(result);
          this.form.updateValueAndValidity();
        }
      });
    });
  }

  private calculateFinish(): void {

    const start = new Date(this.form.controls.start.value);
    start.setSeconds(start.getSeconds() + (this.durationInMilliseconds / 1000));
    this.form.controls.end.patchValue(start.toISOString(), {
      onlySelf: true,
      emitEvent: false,
    });

  }

  private calculateDuration(): void {

    const servicesAreProvidedInParallel = this.form.controls.servicesAreProvidedInParallel.value;

    if (this.form.controls.services.value?.length) {
      if (servicesAreProvidedInParallel) {
        const collection = this.form.controls.services.value.map(
          ({durationVersions}) => calculateDuration(...durationVersions.map(
            ({duration}) => Duration.fromISOTime(duration))
          ));
        this.durationInMilliseconds = calculateDuration(...collection).as('milliseconds');
      } else {
        this.form.controls.services.value.forEach((service) => {
          if (service.durationVersions[0].duration > this.duration) {
            this.durationInMilliseconds = Duration.fromISOTime(service.durationVersions[0].duration).as('milliseconds');
          }
        });
      }
    }

    this.duration = humanizeDuration(this.durationInMilliseconds);

    this.calculateFinish();

  }

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      await firstValueFrom(this.store.dispatch(new EventActions.SaveItem(this.form.getRawValue() as IEvent)));
      const item = await firstValueFrom(this.itemData$);
      if (item) {
        await this.router.navigate([this.baseUrl, 'details', item?._id], {
          relativeTo: this.activatedRoute
        });
      }
      this.form.enable();
      this.form.updateValueAndValidity();

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
