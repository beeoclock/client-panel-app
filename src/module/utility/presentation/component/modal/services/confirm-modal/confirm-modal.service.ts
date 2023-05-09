import {ComponentRef, inject, Injectable} from '@angular/core';
import {
  ModalButtonInterface,
  ModalButtonRoleEnum,
  ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/services/modal/modal.service";

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  private readonly service = inject(ModalService)

  public open(options: {
    buttons: {
      cancel: {
        text: string;
        callback?: () => void
      },
      confirm: {
        text: string;
        callback?: () => void
      }
    },
    title: string;
    contentHTML?: string;
  }): Promise<any> {

    const buttons: ModalButtonInterface[] = [
      {
        text: options.buttons.cancel.text,
        classList: ['btn', 'btn-outline-secondary', 'w-100'],
        role: ModalButtonRoleEnum.cancel,
        callback: (modal: ModalComponent) => {
          options?.buttons?.cancel?.callback?.();
          modal.closeModal();
        }
      },
      {
        text: options.buttons.confirm.text,
        classList: ['btn', 'btn-primary', 'w-100'],
        role: ModalButtonRoleEnum.accept,
        enabledDebounceClick: true,
        callback: (modal: ModalComponent) => {
          options?.buttons?.confirm?.callback?.();
          modal.closeModal();
        }
      }
    ];

    return this.service.create([], {
      buttons,
      title: options.title,
      contentHTML: options?.contentHTML
    }).then((modal: ComponentRef<ModalComponent>) => {
      modal.instance.show();
      return modal;
    });

  }

}
