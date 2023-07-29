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
import {TranslateModule} from "@ngx-translate/core";

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

      <div *ngFor="let selectedService of control.value; let index = index">

        <div class="flex justify-between">
          <span class="text-gray-400">Service #{{ index + 1 }}</span>
          <button (click)="removeServiceFromSelectedList(index)" class="text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
          <i class="bi bi-trash"></i>
          </button>
        </div>

        {{ selectedService.languageVersions[0].title }}

        <hr class="mt-4">

      </div>

      <button (click)="openServiceModal()" class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100">
          <i class="bi bi-plus-lg"></i>
          {{ 'event.form.section.attendant.button.add' | translate }}
      </button>
    </div>
  `
})
export class ServicesFormComponent {

  @Input()
  public control!: FormControl<IService[]>;

  private readonly modalService = inject(ModalService);

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
          this.control.patchValue([...(this.control.value ?? []).filter(({_id}) => _id !== service._id), event])
        } else {
          this.control.patchValue([...(this.control.value ?? []), event])
        }
        modal.instance.closeModal();
      });
      return modal;
    });
  }

  public removeServiceFromSelectedList(deleteIndex: number): void {
    this.control.patchValue(this.control.value.filter(((_, index) => index !== deleteIndex)));
  }

  public editServiceFromSelectedList(service: IService): void {
    this.openServiceModal(service);
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
