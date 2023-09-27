import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {map} from "rxjs";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";

@Component({
	selector: 'identity-create-business-introduction-page',
	templateUrl: './index.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		AsyncPipe,
		BackLinkComponent,
		LogoutComponent,
		NgIf,
		ChangeLanguageComponent
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index {
	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly firstCompany$ = this.activatedRoute.queryParams.pipe(
		map(({firstCompany}) => !!firstCompany)
	);

	public readonly notFirstCompany$ = this.firstCompany$.pipe(
		map((firstCompany) => !firstCompany)
	);


}
