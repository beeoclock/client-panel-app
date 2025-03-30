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
import {ChangeNameForm} from "@tenant/client/presentation/form/change-name.form";
import {ChangeNameComponent} from "@tenant/client/presentation/ui/component/settings/change-name/change-name.component";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";

@Injectable({
	providedIn: 'root'
})
export class ModalChangeNameService extends Reactive {

	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);
	private readonly auth = inject(Auth);
	private readonly store = inject(Store);
	private readonly form = new ChangeNameForm();

	public async openModal(): Promise<void> {

		const title = await this.translateService.instant('change-name.modal.title');

		this.form.controls.name.setValue(this.auth.currentUser?.displayName ?? '');

		return new Promise((resolve, reject) => {
			const buttons: ModalButtonInterface[] = [
				this.cancelButton(reject),
				this.confirmButton(resolve)
			];

			this.modalService.create([{
				component: ChangeNameComponent,
				data: {
					form: this.form
				}
			}], {
				buttons,
				fixHeight: false,
				title
			}).then((modal) => {
				const component = modal.instance.componentChildRefList[0].instance as unknown as ChangeNameComponent;
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
			enabledDebounceClick: true,
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

	/**
	 *
	 * @param callback
	 * @private
	 */
	private cancelButton(callback: CallableFunction): ModalButtonInterface {
		return {
			text: this.translateService.instant('keyword.capitalize.cancel'),
			classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
			role: ModalButtonRoleEnum.cancel,
			callback: (modal: ModalComponent) => {
				modal.closeModal();
				callback();
			}
		};
	}

}
