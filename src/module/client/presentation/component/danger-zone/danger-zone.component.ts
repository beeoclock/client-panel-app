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

@Component({
  selector: 'client-danger-zone-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DeleteButtonComponent
  ],
  template: `
    <div class="
        bg-white
        dark:bg-beeDarkColor-800
        dark:border
        dark:border-beeDarkColor-700
        shadow
        rounded-lg
        mb-4 p-4
      ">

      <h5 class="mb-0">Danger Zone</h5>

      <!--      <h5 class="fs-0">Transfer Ownership</h5>-->
      <!--      <p class="fs&#45;&#45;1">Transfer this account to another user or to an organization where you have the ability to-->
      <!--        create repositories.</p>-->

      <!--      <button class="w-full px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-100" (click)="logout()">-->
      <!--        Transfer-->
      <!--      </button>-->

      <h5 class="fs-0">Delete Business Client</h5>
      <p class="fs--1">Once you delete a account, there is no going back. Please be certain.</p>

      <button class="w-full px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-100"
              (click)="deleteBusinessClient()">
        Delete Business Client
      </button>

    </div>
  `
})
export class DangerZoneComponent {

  private readonly alertController = inject(AlertController);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly deleteBusinessClientClientAdapter = inject(DeleteBusinessClientClientAdapter);

  public async deleteBusinessClient() {
    const alert = await this.alertController.create({
      header: 'Delete Business Client',
      subHeader: 'Once you delete a business client, there is no going back. Please be certain.',
      message: 'Are you sure that you want to delete the business client, then all data will be deleted and it will not be possible to restore them, and all users who had access to this business client will also lose access, if you only want to leave this business client, click on the "Exit this business client" button.',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: async () => {
            const clientId = await firstValueFrom(this.store.select(IdentityState.clientId));
            if (clientId) {
              try {
                const result = await firstValueFrom(this.deleteBusinessClientClientAdapter.deleteBusinessClient(clientId));
                await this.router.navigate(['/', 'identity', 'corridor']);
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
          text: 'No',
          role: 'cancel',
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
  }
}
