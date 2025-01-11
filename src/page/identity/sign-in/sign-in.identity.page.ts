import {ChangeDetectionStrategy, Component, inject, input, OnInit, viewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {NgOptimizedImage} from "@angular/common";
import {AlreadySignUpLinkComponent} from "@identity/presentation/component/link/alredy-sign-up.link.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";
import {environment} from "@environment/environment";

@Component({
	selector: 'app-sign-in-identity-page',
	templateUrl: './sign-in.identity.page.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		SignInComponent,
		CardComponent,
		TranslateModule,
		ChangeLanguageComponent,
		FormsModule,
		NgOptimizedImage,
		PrimaryButtonDirective,
		AlreadySignUpLinkComponent,
		FormInputComponent,
		FormInputPasswordComponent,
		PrimaryLinkStyleDirective
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
