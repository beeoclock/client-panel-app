import {inject, Injectable} from '@angular/core';
import {
  ModalButtonInterface,
  ModalButtonRoleEnum,
  ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {
  ModalSelectSpecialistComponent
} from "@utility/presentation/component/modal-select-specialist/modal-select-specialist.component";
import {IMember} from "@member/domain";
import {Reactive} from "@utility/cdk/reactive";

@Injectable({
  providedIn: 'root'
})
export class ModalSelectSpecialistService extends Reactive {

  private readonly modalService = inject(ModalService);
  private readonly translateService = inject(TranslateService);

  public selectedSpecialistList: IMember[] = [];

  // TODO add edit mode
  public async openServiceModal(): Promise<IMember[]> {

    const title = await this.translateService.instant('event.form.section.service.modal.title');

    return new Promise((resolve, reject) => {
      const buttons: ModalButtonInterface[] = [
        {
          text: 'Cancel',
          classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
          role: ModalButtonRoleEnum.cancel,
          callback: (modal: ModalComponent) => {
            modal.closeModal();
            reject();
          }
        },
        {
          text: 'Confirm',
          classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList,
          role: ModalButtonRoleEnum.accept,
          enabledDebounceClick: true,
          callback: (modal: ModalComponent) => {
            const component = modal.componentChildRefList[0].instance as unknown as ModalSelectSpecialistComponent;
            component.submit().then((newSelectedSpecialistList) => {
              modal.closeModal();
              resolve(newSelectedSpecialistList);
            });
          }
        }
      ];

      this.modalService.create([{
        component: ModalSelectSpecialistComponent,
        data: {
          selectedSpecialistList: this.selectedSpecialistList
        }
      }], {
        buttons,
        fixHeight: false,
        title
      }).then((modal) => {
        const component = modal.instance.componentChildRefList[0].instance as unknown as ModalSelectSpecialistComponent;
        const acceptButton = modal.instance.getButton(ModalButtonRoleEnum.accept);
        if (acceptButton) {
          component.modalSelectSpecialistListAdapter.loading$.state$.pipe(this.takeUntil()).subscribe((loading) => {
            acceptButton.disabled = loading;
          });
        }

        return modal;
      });

    });

  }

}
