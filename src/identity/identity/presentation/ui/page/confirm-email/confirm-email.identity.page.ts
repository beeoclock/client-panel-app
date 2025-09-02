import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {applyActionCode, Auth} from '@angular/fire/auth';
import {AsyncPipe} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {Select, Store} from "@ngxs/store";
import {
	SendConfirmEmailListApiAdapter
} from "@identity/identity/infrastructure/api/send-confirm-email-list.api.adapter";
import {filter, firstValueFrom, Observable} from "rxjs";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {Reactive} from "@core/cdk/reactive";
import {BooleanState} from "@shared/domain";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {LogoutComponent} from "@shared/presentation/ui/component/logout/logout.component";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";

@Component({
	selector: 'app-confirm-email-identity-page',
	templateUrl: './confirm-email.identity.page.html',
	standalone: true,
	imports: [
		AsyncPipe,
		CardComponent,
		TranslateModule,
		PrimaryButtonDirective,
		PrimaryLinkStyleDirective,
		ChangeLanguageComponent,
		LogoutComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class ConfirmEmailIdentityPage extends Reactive implements OnInit {

	public readonly emailSending = new BooleanState(false);
	public readonly emailIsSent = new BooleanState(false);
	public emailUrl = new URL('https://beeoclock.com');
	@Select(IdentityState.accountEmail)
	accountEmail$!: Observable<unknown>;
	private readonly firebaseMode = 'verifyEmail' as const;
	private readonly auth = inject(Auth);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly logger = inject(NGXLogger);
	private readonly store = inject(Store);
	public readonly isAuthorized$ = this.store.select((state) => {
		return state.identity.token !== undefined;
	});
	private readonly router = inject(Router);
	private readonly sendConfirmEmailListApiAdapter = inject(SendConfirmEmailListApiAdapter);
	readonly #analyticsService = inject(AnalyticsService);

	constructor() {
		super();
	}


	public ngOnInit(): void {
		this.#analyticsService.logEvent('confirm_email_page_initialized');
		this.activatedRoute.queryParams.pipe(this.takeUntil()).subscribe((params: Params | {
			mode?: string,
			oobCode?: string,
			continueUrl?: string,
			lang?: string
		}) => {
			if (params?.mode === this.firebaseMode) {
				applyActionCode(this.auth, params.oobCode)
					.then(() => {
						this.logger.debug('email is sent!');
					})
					.catch((error) => {
						this.logger.error(error);
					});
			}
		});
		this.store.select(IdentityState.accountEmailIsVerified).pipe(
			this.takeUntil(),
			filter((isVerified) => !!isVerified),
		).subscribe(() => {
			this.router.navigate(['/']).then();
		});
	}

	public async sendAgain() {
		this.emailSending.switchOn();
		const email = await firstValueFrom(this.accountEmail$);
		if (typeof email === 'string') {
			this.emailUrl = new URL(`https://${email.split('@')[1]}`);
			try {
				await this.sendConfirmEmailListApiAdapter.executeAsync({email});
				this.emailIsSent.switchOn();
			} catch (e) {
				this.logger.error(e);
			}
			this.emailSending.switchOff();
		} else {
			this.logger.error('email is not string', email);
		}
	}

}

export default ConfirmEmailIdentityPage;
