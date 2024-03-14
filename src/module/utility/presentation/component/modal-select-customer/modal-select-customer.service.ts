import {inject, Injectable} from '@angular/core';
import {
	ModalButtonInterface,
	ModalButtonRoleEnum,
	ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {
	ModalSelectCustomerComponent
} from "@utility/presentation/component/modal-select-customer/modal-select-customer.component";
import {ICustomer} from "@customer/domain";

type RESOLVE_TYPE = { (value: ICustomer[] | PromiseLike<ICustomer[]>): void; (arg0: ICustomer[]): void; };
type REJECT_TYPE = { (reason?: any): void; (arg0?: any): void; };

@Injectable({
	providedIn: 'root'
})
export class ModalSelectCustomerService extends Reactive {

	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);

	public async openCustomerModal(params: {
		multiSelect?: boolean;
		selectedServiceList?: ICustomer[];
	} = {
		multiSelect: true,
		selectedServiceList: []
	}): Promise<ICustomer[]> {

		const title = await this.translateService.instant('event.form.section.customer.modal.title');

		return new Promise((resolve: RESOLVE_TYPE, reject: REJECT_TYPE) => {

			this.modalService.create([{
				component: ModalSelectCustomerComponent,
				data: {
					selectedServiceList: params.selectedServiceList,
					multiple: params.multiSelect
				}
			}], {
				buttons: this.buttons(resolve, reject),
				fixHeight: false,
				title,
				contentPadding: false
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
				const component = modal.componentChildRefList[0].instance as unknown as ModalSelectCustomerComponent;
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
			visible: false,
			callback
		};
	}

}
