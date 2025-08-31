import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {Select} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular/standalone";
import {WithTenantIdPipe} from "@shared/presentation/pipes/with-tenant-id.pipe";
import {LogoutService} from "@shared/presentation/ui/component/logout/logout.service";


@Component({
	standalone: true,
	selector: 'utility-sidebar-profile-component',
	templateUrl: './profile.sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		RouterLink,
		TranslateModule,
		WithTenantIdPipe
	],
})
export class ProfileSidebarComponent {

	private readonly logger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);
	private readonly alertController = inject(AlertController);
	private readonly logoutService = inject(LogoutService);
	private readonly router = inject(Router);

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

	public goToCorridor() {
		this.router.navigate([{outlets: {second: null}}]).then(() => {
			this.router.navigate(['/', 'identity', 'corridor', {outlets: {second: null}}], {
				queryParams: {force: true},
			}).then()
		})
	}
}
