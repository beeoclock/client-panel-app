import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {SignUpComponent} from "@identity/identity/presentation/component/sign-up.component/sign-up.component";

@Component({
	selector: 'app-sign-up-identity-page',
	template: `
		<identity-sign-up-component/>
	`,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		SignUpComponent,
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
