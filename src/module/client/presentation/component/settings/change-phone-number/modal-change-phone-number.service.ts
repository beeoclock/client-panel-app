import {inject, Injectable} from '@angular/core';
import {
	ModalButtonInterface,
	ModalButtonRoleEnum,
	ModalComponent
} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {Auth} from "@angular/fire/auth";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/infrastructure/state/identity/identity.actions";
import {ChangePhoneNumberForm} from "@client/presentation/form/change-phone-number.form";
import {
	ChangePhoneNumberComponent
} from "@client/presentation/component/settings/change-phone-number/change-phone-number.component";

@Injectable({
	providedIn: 'root'
})
export class ModalChangePhoneNumberService extends Reactive {

	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);
	private readonly auth = inject(Auth);
	private readonly store = inject(Store);
	private readonly form = new ChangePhoneNumberForm();

	public async openModal(): Promise<void> {

		const title = await this.translateService.instant('change-phone-number.modal.title');

		this.form.controls.phoneNumber.setValue(this.auth.currentUser?.phoneNumber ?? '');

		return new Promise((resolve) => {
			const buttons: ModalButtonInterface[] = [
				this.cancelButton(),
				this.confirmButton(resolve)
			];

			this.modalService.create([{
				component: ChangePhoneNumberComponent,
				data: {
					form: this.form
				}
			}], {
				buttons,
				fixHeight: false,
				title
			}).then((modal) => {
				const component = modal.instance.componentChildRefList[0].instance as unknown as ChangePhoneNumberComponent;
				const acceptButton = modal.instance.getButton(ModalButtonRoleEnum.accept);
				if (acceptButton) {
					component.form.statusChanges.pipe(this.takeUntil()).subscribe((status) => {
						acceptButton.disabled = status === 'PENDING' || status === 'INVALID';
						acceptButton.loading = status === 'PENDING';
					});
				}

				return modal;
			});

		});

	}

	/**
	 *
	 * @param callback
	 * @private
	 */
	private confirmButton(callback: CallableFunction): ModalButtonInterface {
		return {
			text: this.translateService.instant('keyword.capitalize.save'),
			classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList,
			role: ModalButtonRoleEnum.accept,
			callback: (modal: ModalComponent) => {
				const component = modal.componentChildRefList[0].instance;
				component.submit().then(() => {
					this.store.dispatch(new IdentityActions.InitToken());
					modal.closeModal();
					callback();
				});
			}
		};
	}

	private cancelButton(): ModalButtonInterface {
		return {
			text: this.translateService.instant('keyword.capitalize.cancel'),
			classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
			role: ModalButtonRoleEnum.cancel,
			callback: (modal: ModalComponent) => {
				modal.closeModal();
			}
		};
	}

}
