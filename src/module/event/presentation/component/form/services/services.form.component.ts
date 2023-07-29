import {Component, inject, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";
import {
  ModalButtonInterface,
  ModalButtonRoleEnum,
  ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ServiceComponent} from "@event/presentation/component/form/service/service.component";
import {IMember} from "@member/domain";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {NgForOf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {is} from "thiis";

@Component({
  selector: 'event-services-form-component',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  template: `
    <!--<utility-back-link-component [url]="cancelUrl"></utility-back-link-component>-->

    <!--<form [formGroup]="form">-->

    <!--  <div class="grid grid-cols-12 gap-4">-->

    <!--    <div class="col-span-12 lg:col-span-8">-->

    <!--      <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-lg p-4">-->

    <!--        <div class="form-check mb-4">-->
    <!--          <input class="form-check-input" formControlName="servicesAreProvidedInParallel" type="checkbox" [value]="true" id="servicesAreProvidedInParallel">-->
    <!--          <label class="form-check-label" for="servicesAreProvidedInParallel">-->
    <!--            Services are provided in parallel-->
    <!--          </label>-->
    <!--        </div>-->

    <!--        <div-->
    <!--          *ngFor="let service of form.controls.services.value; let index = index;"-->
    <!--          class="border border-beeColor-200 rounded-lg dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white">-->
    <!--          <div-->
    <!--            class="-->
    <!--              justify-between-->
    <!--              flex-->
    <!--              w-full-->
    <!--              px-4-->
    <!--              py-2-->
    <!--              bg-beeColor-100-->
    <!--              border-b-->
    <!--              border-beeColor-200-->
    <!--              rounded-t-lg-->
    <!--              cursor-pointer-->
    <!--              dark:bg-beeDarkColor-800-->
    <!--              dark:border-beeDarkColor-600">-->
    <!--            Service #{{ index + 1 }}-->
    <!--            <button class="text-red-500" (click)="removeServiceFromSelectedList(index)">-->
    <!--              <i class="bi bi-trash"></i>-->
    <!--            </button>-->
    <!--          </div>-->
    <!--          <ul class="text-sm font-medium text-beeColor-900 bg-white rounded-lg dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white">-->
    <!--            <li class="w-full px-4 py-2 border-b border-beeColor-200 dark:border-beeDarkColor-600">-->
    <!--              {{ service.languageVersions[0].language | language }}-->
    <!--            </li>-->
    <!--            <li class="w-full px-4 py-2 border-b border-beeColor-200 dark:border-beeDarkColor-600">-->
    <!--              {{ service.languageVersions[0].title }}-->
    <!--            </li>-->
    <!--            <li class="w-full px-4 py-2 border-b border-beeColor-200 dark:border-beeDarkColor-600">-->
    <!--              <i class="bi bi-person"></i>-->
    <!--              {{ getPermanentMembers(service.permanentMembers) }}-->
    <!--            </li>-->
    <!--            <li class="w-full px-4 py-2 border-b border-beeColor-200 dark:border-beeDarkColor-600">-->
    <!--              Duration: {{ service.durationVersions[0].duration }}-->
    <!--            </li>-->
    <!--            <li class="w-full px-4 py-2 border-b border-beeColor-200 dark:border-beeDarkColor-600">-->
    <!--              Price: {{ service.durationVersions[0].prices[0].price }} {{ service.durationVersions[0].prices[0].currency }}-->
    <!--            </li>-->
    <!--            <li class="w-full px-4 py-2 dark:border-beeDarkColor-600 text-orange-500 cursor-pointer hover:bg-orange-100" (click)="editServiceFromSelectedList(service)">-->
    <!--              Edit-->
    <!--            </li>-->
    <!--          </ul>-->
    <!--        </div>-->

    <!--        <div class="mt-4">-->
    <!--          <button-->
    <!--            class="px-4 py-2 border rounded w-full hover:bg-beeColor-100"-->
    <!--            [disabled]="form.disabled"-->
    <!--            (click)="openServiceModal()">-->
    <!--            <i class="bi bi-plus-lg me-2"></i>-->
    <!--            Add service-->
    <!--          </button>-->
    <!--        </div>-->

    <!--      </div>-->
    <!--      <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-lg p-4">-->

    <!--        <div class="relative">-->
    <!--          <label for="event-form-start">Start</label>-->
    <!--          <ion-datetime-button datetime="event-form-start"></ion-datetime-button>-->

    <!--          <ion-modal [keepContentsMounted]="true">-->
    <!--            <ng-template>-->
    <!--              <ion-datetime formControlName="start" id="event-form-start"></ion-datetime>-->
    <!--            </ng-template>-->
    <!--          </ion-modal>-->
    <!--        </div>-->
    <!--        In future add feature to chose slots-->
    <!--        <div class="mt-3">-->
    <!--          Duration:-->
    <!--          <ng-container *ngIf="!duration.length">-->
    <!--            <small class="text-warning">Select services to calculate duration of event</small>-->
    <!--          </ng-container>-->
    <!--          <ng-container *ngIf="duration.length">-->
    <!--            {{ duration }}-->
    <!--          </ng-container>-->
    <!--        </div>-->
    <!--        <div class="mt-3">-->
    <!--          Finish at:-->
    <!--          {{ form.controls.end.value | date: 'full' }}-->
    <!--        </div>-->
    <!--        <div class="mt-3">-->
    <!--          <label for="event-form-description">Description</label>-->
    <!--          <textarea-->
    <!--            class="px-3 py-2 border rounded w-full"-->
    <!--            hasError-->
    <!--            invalidTooltip-->
    <!--            placeholder="Write some description of event"-->
    <!--            id="event-form-description"-->
    <!--            formControlName="description"></textarea>-->
    <!--        </div>-->

    <!--      </div>-->

    <!--    </div>-->

    <!--    <div class="col-span-12 lg:col-span-4">-->

    <!--      <div-->
    <!--        class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-lg p-4">-->

    <!--        Attendees-->

    <!--        <event-attendees-component [form]="form.controls.attendees"></event-attendees-component>-->

    <!--      </div>-->

    <!--    </div>-->

    <!--  </div>-->

    <!--  <div class="mt-4">-->

    <!--    <button-->
    <!--      class="bg-blue-600 text-white rounded px-4 py-2 w-full"-->
    <!--      [disabled]="form.disabled"-->
    <!--      (click)="save()">-->
    <!--      {{ 'general.save' | translate }}-->
    <!--    </button>-->

    <!--  </div>-->
    <!--</form>-->

    <div class="flex flex-col gap-4">

      <strong class="text-2xl">{{ 'general.services' | translate }}</strong>

      <div *ngFor="let selectedService of control.value; let index = index" class="flex flex-col gap-3">

        <div class="flex justify-between">
          <span class="text-gray-400">Service #{{ index + 1 }}</span>
          <div class="flex gap-3">

            <button (click)="openServiceModal(index)"
                    class="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-2xl">
              <i class="bi bi-pencil"></i>
            </button>

            <button (click)="removeServiceFromSelectedList(index)"
                    class="text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="pt-1">
            <div class="w-[70px] h-[70px] bg-gray-300 rounded-2xl"></div>
          </div>
          <div class="flex flex-col">
            <span class="font-bold">
              {{ selectedService.languageVersions[0].title }}
            </span>
            <span class="text-sm text-gray-500">
              {{ selectedService.languageVersions[0].description }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold">
              {{ selectedService.durationVersions[0].prices[0].price }} {{ selectedService.durationVersions[0].prices[0].currency }}
            </span>
            <span class="text-sm">
              {{ selectedService.durationVersions[0].duration }}
            </span>
          </div>
        </div>

        <hr class="mt-4">

      </div>

      <button (click)="openServiceModal()" class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100">
        <i class="bi bi-plus-lg"></i>
        {{ 'event.form.section.service.button.add' | translate }}
      </button>
    </div>
  `
})
export class ServicesFormComponent {

  @Input()
  public control!: FormControl<IService[]>;

  private readonly modalService = inject(ModalService);
  private readonly translateService = inject(TranslateService);

  public async openServiceModal(selectedIndex?: number): Promise<void> {

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

    const title = await this.translateService.instant('event.form.section.service.modal.title');

    this.modalService.create([{
      component: ServiceComponent,
      data: {}
    }], {
      buttons,
      fixHeight: false,
      title
    }).then((modal) => {
      const serviceComponent = modal.instance.componentChildRefList[0].instance as unknown as ServiceComponent;
      const service = is.number(selectedIndex) ? this.control.value[selectedIndex] : undefined;
      if (service) {
        serviceComponent.setSelectedService(service);
      }
      serviceComponent.emitter.subscribe((event: IService) => {
        const prevValue = this.control.value ?? [];

        if (service && is.number(selectedIndex)) {
          prevValue[selectedIndex] = event;
        } else {
          prevValue.push(event);
        }
        this.control.patchValue(prevValue)
        modal.instance.closeModal();
      });
      return modal;
    });
  }

  public removeServiceFromSelectedList(deleteIndex: number): void {
    this.control.patchValue(this.control.value.filter(((_, index) => index !== deleteIndex)));
  }

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

}
