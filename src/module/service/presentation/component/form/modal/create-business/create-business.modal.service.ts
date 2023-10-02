import {inject, Injectable} from "@angular/core";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {
	ModalButtonInterface,
	ModalButtonRoleEnum,
	ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {
	CreateBusinessComponent
} from "@service/presentation/component/form/modal/create-business/create-business.component";
import {ServiceForm} from "@service/presentation/form";

type RESOLVE_TYPE = { (value: ServiceForm | PromiseLike<ServiceForm>): void; (arg0: ServiceForm): void; };
type REJECT_TYPE = { (reason?: any): void; (arg0?: any): void; };

@Injectable({
	providedIn: 'root'
})
export class CreateBusinessModalService {

	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);

	public async openServiceFormModal(serviceForm?: ServiceForm): Promise<ServiceForm> {

		const title = await this.translateService.instant('service.title');
		const data: {form?: ServiceForm} = {};

		if (serviceForm) {
			data['form'] = serviceForm;
		}

		return new Promise((resolve, reject) => {

			this.modalService.create([{
				component: CreateBusinessComponent,
				data
			}], {
				buttons: this.buttons(resolve, reject),
				fixHeight: false,
				title
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
				const component = modal.componentChildRefList[0].instance as unknown as CreateBusinessComponent;
				component.submit().then((serviceForm: ServiceForm) => {
					modal.closeModal();
					resolve(serviceForm);
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
			text: this.translateService.instant('keyword.capitalize.save'),
			classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList,
			role: ModalButtonRoleEnum.accept,
			enabledDebounceClick: true,
			callback
		};
	}

}
