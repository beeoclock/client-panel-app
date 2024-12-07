import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SignUpComponent} from '@identity/presentation/component/sign-up.component/sign-up.component';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {AlreadySignUpLinkComponent} from "@identity/presentation/component/link/alredy-sign-up.link.component";

@Component({
	selector: 'app-sign-up-identity-page',
	template: `
		<identity-sign-up-component/>
	`,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		RouterLink,
		TranslateModule,
		SignUpComponent,
		CardComponent,
		ChangeLanguageComponent,
		AlreadySignUpLinkComponent,
	],
	encapsulation: ViewEncapsulation.None
})
export class SignUpIdentityPage implements OnInit {
	readonly #analyticsService = inject(AnalyticsService);

	public ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
	}
}

export default SignUpIdentityPage;
