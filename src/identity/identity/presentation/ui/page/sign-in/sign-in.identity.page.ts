import {ChangeDetectionStrategy, Component, inject, input, OnInit, viewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {NgOptimizedImage} from "@angular/common";
import {environment} from "@environment/environment";
import {SignInComponent} from "@identity/identity/presentation/component/sign-in.component/sign-in.component";

@Component({
	selector: 'app-sign-in-identity-page',
	templateUrl: './sign-in.identity.page.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		SignInComponent,
		TranslateModule,
		ChangeLanguageComponent,
		FormsModule,
		NgOptimizedImage,
	],
	encapsulation: ViewEncapsulation.None
})
export class SignInIdentityPage implements OnInit {

	public readonly login = input<string | null>(null);

	public readonly password = input<string | null>(null);

	public readonly footerLabel = environment.footer.label;
	readonly signInComponent = viewChild.required(SignInComponent);
	readonly #analyticsService = inject(AnalyticsService);

	public initialLoginValues(): {
		email: string;
		password: string;
	} {
		return {
			email: this.login() ?? '',
			password: this.password() ?? ''
		}
	}

	public ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
	}

	protected loginIntoDemoProfile() {

		this.signInComponent().doSignIn('demo@beeoclock.com', 'ItIckBeRSOLDENZYGosicirE');

	}
}

export default SignInIdentityPage;
