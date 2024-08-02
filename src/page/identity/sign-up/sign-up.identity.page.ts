import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {SignUpComponent} from '@identity/presentation/component/sign-up.component/sign-up.component';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {SignInComponent} from "@identity/presentation/component/sign-in.component/sign-in.component";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
  selector: 'app-sign-up-identity-page',
  templateUrl: './sign-up.identity.page.html',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslateModule,
        NgIf,
        SignUpComponent,
        CardComponent,
        ChangeLanguageComponent,
        NgOptimizedImage,
        SignInComponent
    ],
  encapsulation: ViewEncapsulation.None
})
export class SignUpIdentityPage implements OnInit {
	readonly #analyticsService = inject(AnalyticsService);
	public  ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
	}
}

export default SignUpIdentityPage;
