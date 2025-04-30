import {Component, inject, ViewEncapsulation} from '@angular/core';
import {
	DeleteBusinessClientClientAdapter
} from "@identity/identity/infrastructure/module/delete-business-client.client.adapter";
import {AlertController} from "@ionic/angular/standalone";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TENANT_ID} from "@src/token";

@Component({
	selector: 'client-danger-zone-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule
	],
	template: `
		<bee-card>
			<span class="text-2xl font-bold text-beeColor-500">{{ 'danger-zone.title' | translate }}</span>

			<!--      <h5 class="fs-0">Transfer Ownership</h5>-->
			<!--      <p class="fs&#45;&#45;1">Transfer this account to another user or to an organization where you have the ability to-->
			<!--        create repositories.</p>-->

			<!--      <button class="w-full px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-100" (click)="logout()">-->
			<!--        Transfer-->
			<!--      </button>-->

			<p>
				{{ 'danger-zone.button.delete.title' | translate }}
			</p>

			<div>
				<button type="button"
						class="w-auto px-4 py-2 rounded-2xl border border-red-500 text-red-500 hover:bg-red-100"
						(click)="deleteBusinessClient()">
					{{ 'danger-zone.button.delete.label' | translate }}
				</button>
				<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
					{{ 'danger-zone.button.delete.hint' | translate }}
				</div>
			</div>
		</bee-card>
	`
})
export class DangerZoneComponent {

	private readonly translateService = inject(TranslateService);
	private readonly alertController = inject(AlertController);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly tenantId$ = inject(TENANT_ID);
	private readonly deleteBusinessClientClientAdapter = inject(DeleteBusinessClientClientAdapter);

	public async deleteBusinessClient() {
		// TODO add input to write name of business before delete business client

		const header = this.translateService.instant('danger-zone.button.delete.confirm.title');
		const subHeader = this.translateService.instant('danger-zone.button.delete.confirm.sub-title');
		const message = this.translateService.instant('danger-zone.button.delete.confirm.message');

		const alert = await this.alertController.create({
			header,
			subHeader,
			message,
			buttons: [
				{
					text: this.translateService.instant('keyword.capitalize.yes'),
					role: 'confirm',
					handler: async () => {
						const tenantId = await firstValueFrom(this.tenantId$);
						if (tenantId) {
							try {
								await firstValueFrom(this.deleteBusinessClientClientAdapter.deleteBusinessClient(tenantId));
								await this.router.navigate(['/', 'identity', 'corridor'], {
									queryParams: {
										force: true
									}
								});
							} catch (e) {
								const errorAlert = await this.alertController.create({
									header,
									subHeader: this.translateService.instant('keyword.capitalize.error'),
									message: this.translateService.instant('keyword.capitalize.somethingWentWrong'),
									buttons: ['OK']
								});
								await errorAlert.present();
							}
						} else {
							throw new Error('tenantId is empty!');
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
