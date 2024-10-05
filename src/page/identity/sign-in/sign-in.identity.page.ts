import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {NgOptimizedImage} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {AnalyticsService} from "@utility/cdk/analytics.service";

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
		NgOptimizedImage,
		PrimaryButtonDirective
	],
	encapsulation: ViewEncapsulation.None
})
export class SignInIdentityPage implements OnInit {

	@Input()
	public login: string | null = null;

	@Input()
	public password: string | null = null;

	readonly #analyticsService = inject(AnalyticsService);

	public initialLoginValues(): {
		email: string;
		password: string;
	} {
		return {
			email: this.login ?? '',
			password: this.password ?? ''
		}
	}

	public ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
	}
}

export default SignInIdentityPage;
