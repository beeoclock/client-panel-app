import {inject, Injectable} from '@angular/core';
import {
	ModalButtonInterface,
	ModalButtonRoleEnum,
	ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {IService} from "@service/domain";
import {
	ModalSelectServiceComponent
} from "@utility/presentation/component/modal-select-service/modal-select-service.component";

type RESOLVE_TYPE = { (value: IService[] | PromiseLike<IService[]>): void; (arg0: IService[]): void; };
type REJECT_TYPE = { (reason?: any): void; (arg0?: any): void; };

@Injectable({
  providedIn: 'root'
})
export class ModalSelectServiceService extends Reactive {

  private readonly modalService = inject(ModalService);
  private readonly translateService = inject(TranslateService);

  public async openServiceModal(params: {
    multiSelect?: boolean;
    selectedServiceList?: IService[];
  } = {
    multiSelect: true,
    selectedServiceList: []
  }): Promise<IService[]> {

    const title = await this.translateService.instant('event.form.section.service.modal.title');

    return new Promise((resolve: RESOLVE_TYPE, reject: REJECT_TYPE) => {

      this.modalService.create([{
        component: ModalSelectServiceComponent,
        data: {
          selectedServiceList: params.selectedServiceList,
          multiple: params.multiSelect
        }
      }], {
        buttons: this.buttons(resolve, reject),
        fixHeight: false,
        title,
				contentPadding: false
      }).then((modal) => {
        // const component = modal.instance.componentChildRefList[0].instance as unknown as ModalSelectServiceComponent;
        // const acceptButton = modal.instance.getButton(ModalButtonRoleEnum.accept);
        // if (acceptButton) {
        //   component.modalSelectServiceListAdapter.loading$.state$.pipe(this.takeUntil()).subscribe((loading) => {
        //     acceptButton.disabled = loading;
        //   });
        // }

        return modal;
      });

    });

  }

  private buttons(resolve: RESOLVE_TYPE, reject: REJECT_TYPE): ModalButtonInterface[] {
    return [
      this.cancelButton((modal: ModalComponent) => {
        modal.closeModal();
        reject();
      }),
      this.confirmButton((modal: ModalComponent) => {
        const component = modal.componentChildRefList[0].instance as unknown as ModalSelectServiceComponent;
        component.submit().then((newSelectedService) => {
          modal.closeModal();
          resolve(newSelectedService);
        });
      })
    ];
  }

  private cancelButton(callback: (modal: ModalComponent) => void): ModalButtonInterface {
    return {
      text: this.translateService.instant('keyword.capitalize.cancel'),
      classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
      role: ModalButtonRoleEnum.cancel,
      callback
    };
  }

  private confirmButton(callback: (modal: ModalComponent) => void): ModalButtonInterface {
    return {
      text: this.translateService.instant('keyword.capitalize.confirm'),
      classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList,
      role: ModalButtonRoleEnum.accept,
      enabledDebounceClick: true,
      callback
    };
  }

}
