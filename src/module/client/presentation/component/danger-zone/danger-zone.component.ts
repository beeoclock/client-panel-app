import {Component, inject, ViewEncapsulation} from '@angular/core';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {
	DeleteBusinessClientClientAdapter
} from "@identity/adapter/external/module/delete-business-client.client.adapter";
import {AlertController} from "@ionic/angular";
import {Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
  selector: 'client-danger-zone-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DeleteButtonComponent,
    CardComponent,
    TranslateModule
  ],
  template: `
    <bee-card borderColor="border-red-500" darkBorderColor="border-red-500">
      <span class="text-2xl font-bold text-beeColor-500">{{ 'danger-zone.title' | translate }}</span>

      <!--      <h5 class="fs-0">Transfer Ownership</h5>-->
      <!--      <p class="fs&#45;&#45;1">Transfer this account to another user or to an organization where you have the ability to-->
      <!--        create repositories.</p>-->

      <!--      <button class="w-full px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-100" (click)="logout()">-->
      <!--        Transfer-->
      <!--      </button>-->

      <p>
        Delete business account. After deleting the business account, there is no going back. Please consider this action carefully.
      </p>

      <div>
        <button type="button" class="w-auto px-4 py-2 rounded-2xl border border-red-500 text-red-500 hover:bg-red-100"
                (click)="deleteBusinessClient()">
          {{ 'danger-zone.button.delete.label' | translate }}
        </button>
      </div>
    </bee-card>
  `
})
export class DangerZoneComponent {

  private readonly translateService = inject(TranslateService);
  private readonly alertController = inject(AlertController);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly deleteBusinessClientClientAdapter = inject(DeleteBusinessClientClientAdapter);

  public async deleteBusinessClient() {
    // TODO add input to write name of business before delete business client
    const alert = await this.alertController.create({
      header: 'Delete Business Client',
      subHeader: 'Once you delete a business client, there is no going back. Please be certain.',
      message: 'Are you sure that you want to delete the business client, then all data will be deleted and it will not be possible to restore them, and all users who had access to this business client will also lose access, if you only want to leave this business client, click on the "Exit this business client" button.',
      buttons: [
        {
          text: this.translateService.instant('keyword.capitalize.yes'),
          role: 'confirm',
          handler: async () => {
            const clientId = await firstValueFrom(this.store.select(IdentityState.clientId));
            if (clientId) {
              try {
                await firstValueFrom(this.deleteBusinessClientClientAdapter.deleteBusinessClient(clientId));
                await this.router.navigate(['/', 'identity', 'corridor'], {
                  queryParams: {
                    force: true
                  }
                });
              } catch (e) {
                const errorAlert = await this.alertController.create({
                  header: 'Delete Business Client',
                  subHeader: 'Error',
                  message: 'Something went wrong!',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            } else {
              throw new Error('clientId is empty!');
            }
          },
        },
        {
          text: this.translateService.instant('keyword.capitalize.no'),
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
