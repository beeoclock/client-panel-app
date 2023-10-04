import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Auth} from "@angular/fire/auth";
import {Router, RouterLink} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {Select} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/state/identity/identity.state";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";


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
		NgIf
	],
})
export class ProfileSidebarComponent {

	private readonly auth = inject(Auth);
	private readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);
	private readonly translateService= inject(TranslateService);
	private readonly alertController = inject(AlertController);

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
			await this.auth.signOut();
			this.router.navigate(['/']).then();
		} catch (error) {
			this.logger.error(error);
		}

	}

}
