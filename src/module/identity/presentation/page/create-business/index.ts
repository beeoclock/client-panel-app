import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import BusinessClientForm from "@identity/form/business-client.form";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";

@Component({
  selector: 'identity-create-business-page',
  templateUrl: 'index.html',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        BackLinkComponent,
        FormInputComponent,
        ChangeLanguageComponent,
        FormTextareaComponent
    ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly translateService = inject(TranslateService);
  public readonly identityApiAdapter = inject(IdentityApiAdapter);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);

  public readonly form = new BusinessClientForm();

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const clientId = await firstValueFrom(this.identityApiAdapter.postCreateBusinessClient$(this.form.getRawValue())).then(async () => {
        const toast = await this.toastController.create({
          header: 'Business client',
          message: 'You successfully create new business client!',
          color: 'success',
          position: 'top',
          duration: 10_000,
          buttons: [
            {
              text: this.translateService.instant('keyword.capitalize.close'),
              role: 'cancel',
            },
          ],
        });
        await toast.present();
        await this.router.navigate(['/', 'identity', 'corridor']);
      });
    }
  }

}
