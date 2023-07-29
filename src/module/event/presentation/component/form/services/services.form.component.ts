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
                    class="text-gray-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
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

        <div class="flex gap-4">
          <div class="pt-1">
            <div class="w-[70px] flex justify-end">
              <div class="w-[44px] h-[44px] bg-gray-300 rounded-2xl"></div>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-bold">
              Specialist
            </span>
            <span class="text-sm text-gray-500">
              {{ getPermanentMembers(selectedService.permanentMembers) }}
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
