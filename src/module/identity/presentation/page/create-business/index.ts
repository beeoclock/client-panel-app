import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import BusinessClientForm from "@identity/form/business-client.form";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'identity-create-business-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly identityApiAdapter = inject(IdentityApiAdapter);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);

  public readonly form = new BusinessClientForm();

  @HostBinding()
  public readonly class = 'w-96 p-8 border dark:border-beeDarkColor-700 bg-white rounded dark:bg-beeDarkColor-800';

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const clientId = await firstValueFrom(this.identityApiAdapter.postCreateBusinessClient$(this.form.getRawValue())).then(async () => {
        const toast = await this.toastController.create({
          header: 'Sign up',
          message: 'Success',
          color: 'success',
          position: 'top'
        });
        await toast.present();
        await this.router.navigate(['/', 'identity', 'corridor']);
      });
      console.log(clientId);
    }
  }

}
