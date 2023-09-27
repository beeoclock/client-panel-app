import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {applyActionCode, Auth} from '@angular/fire/auth';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {Select, Store} from "@ngxs/store";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {SendConfirmEmailListApiAdapter} from "@identity/adapter/external/api/send-confirm-email-list.api.adapter";
import {IdentityState} from "@identity/state/identity/identity.state";
import {firstValueFrom, Observable} from "rxjs";

@Component({
	selector: 'identity-confirm-email-page',
	templateUrl: 'index.html',
	standalone: true,
	imports: [
		NgOptimizedImage,
		NgIf,
		AsyncPipe
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

	private readonly firebaseMode = 'verifyEmail' as const;
	private readonly auth = inject(Auth);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly logger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly sendConfirmEmailListApiAdapter = inject(SendConfirmEmailListApiAdapter);

	public readonly isAuthorized$ = this.store.select((state) => {
		return state.identity.token !== undefined;
	});

	@Select(IdentityState.accountEmail)
	accountEmail$!: Observable<unknown>;

	public ngOnInit(): void {
		this.store.dispatch(new IdentityActions.InitToken())
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

	public async sendAgain() {
		const email = await firstValueFrom(this.accountEmail$);
		this.sendConfirmEmailListApiAdapter.executeAsync({email}).then();
	}

}
