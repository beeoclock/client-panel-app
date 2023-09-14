import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {applyActionCode, Auth} from '@angular/fire/auth';
import {NgOptimizedImage} from "@angular/common";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'identity-confirm-email-page',
	templateUrl: 'index.html',
	standalone: true,
	imports: [
		NgOptimizedImage
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

	private readonly firebaseMode = 'verifyEmail' as const;
	private readonly auth: Auth = inject(Auth);
	private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	private readonly logger = inject(NGXLogger);

	public ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((params: Params | {
			mode?: string,
			oobCode?: string,
			continueUrl?: string,
			lang?: string
		}) => {
			if (params?.mode === this.firebaseMode) {
				applyActionCode(this.auth, params.oobCode)
					.then(() => {
						this.logger.info('E-mail is verified');
					})
					.catch((error) => {
						this.logger.error(error);
					});
			}
		});
	}

}
