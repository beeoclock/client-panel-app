import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {Select} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";
import {WithTenantIdPipe} from "@utility/presentation/pipes/with-tenant-id.pipe";
import {LogoutService} from "@utility/presentation/component/logout/logout.service";


@Component({
	standalone: true,
	selector: 'utility-sidebar-profile-component',
	templateUrl: './profile.sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		RouterLink,
		TranslateModule,
		NgForOf,
		NgIf,
		WithTenantIdPipe
	],
})
export class ProfileSidebarComponent {

	private readonly logger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);
	private readonly alertController = inject(AlertController);
	private readonly logoutService = inject(LogoutService);

	@Select(IdentityState.token)
	public token$!: Observable<BeeoclockIdTokenResult>;

	public async signOut() {

		const alert = await this.alertController.create({
			header: this.translateService.instant('sidebar.profile.signOut.header'),
			message: this.translateService.instant('sidebar.profile.signOut.message'),
			buttons: [
				{
					text: this.translateService.instant('keyword.capitalize.no'),
					role: 'cancel',
				},
				{
					text: this.translateService.instant('keyword.capitalize.yes'),
					role: 'confirm',
				}
			]

		});

		await alert.present();

		const {role} = await alert.onDidDismiss();

		if (role === 'cancel') {
			return;
		}

		try {
			this.logoutService.logout();
		} catch (error) {
			this.logger.error(error);
		}

	}

}
