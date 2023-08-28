import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {ToastController} from "@ionic/angular";
import {ChangePhoneNumberClientAdapter} from "@identity/adapter/external/module/change-phone-number.client.adapter";
import {ChangePhoneNumberForm} from "@client/presentation/form/change-phone-number.form";

@Component({
  selector: 'client-change-phone-number-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    LoaderComponent,
    NgIf,
    TranslateModule,
    FormInputComponent
  ],
  template: `

    <div class="pb-4">

      <form-input
        id="client-form-phoneNumber"
        type="text"
        autocomplete="phoneNumber"
        [placeholder]="'change-phone-number.form.input.phoneNumber.placeholder' | translate"
        [control]="form.controls.phoneNumber"
        [label]="'keyword.capitalize.phone' | translate">
      </form-input>

    </div>

  `
})
export class ChangePhoneNumberComponent {

  public form = new ChangePhoneNumberForm();
  private readonly changePhoneNumberClientAdapter = inject(ChangePhoneNumberClientAdapter);
  private readonly toastController = inject(ToastController);
  private readonly translateService = inject(TranslateService);

  public submit(): Promise<unknown> {
    this.form.markAsPending();
    return this.changePhoneNumberClientAdapter.changePhoneNumberApiAdapter.executeAsync(this.form.value)
      .then((result) => {
        this.toastController.create({
          header: this.translateService.instant('change-name.modal.title'),
          message: 'Success',
          color: 'success',
          position: 'top',
          duration: 10_000,
          buttons: [
            {
              text: this.translateService.instant('keyword.capitalize.close'),
              role: 'cancel',
            },
          ],
        }).then((toast) => {
          toast.present();
        });
        return result;
      })
      .catch(() => {
        this.form.markAsPristine();
      });
  }

}
