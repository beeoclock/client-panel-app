import {Component} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'identity-already-sign-up-link-component',
	template: `
		<p class="text-center text-sm text-beeColor-500">
			{{ 'identity.sign-up.hint.youHaveAnAccount' | translate }}
			<a routerLink=".." id="already-sign-in-link" class="font-semibold leading-6 text-blue-600 dark:text-black hover:text-blue-500">
				{{ 'keyword.capitalize.signIn' | translate }}
			</a>
		</p>
	`,
	standalone: true,
	imports: [
		TranslateModule,
		RouterLink
	]
})
export class AlreadySignUpLinkComponent {

}
