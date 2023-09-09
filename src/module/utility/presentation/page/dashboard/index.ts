import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ParsedToken} from '@angular/fire/auth';
import {Router, RouterLink} from "@angular/router";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";

export interface BeeoclockParsedToken extends ParsedToken {
  role: string[];
  accountId: string;
  clientId: string;
}

@Component({
  selector: 'utility-dashboard-page',
  templateUrl: 'index.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		RouterLink,
		CardComponent,
		TranslateModule,
		PrimaryButtonDirective,
		PrimaryLinkButtonDirective
	]
})
export default class Index {
	private readonly router = inject(Router);

	public readonly returnUrl = this.router.url;
}
