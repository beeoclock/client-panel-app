import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {filter, map, Observable, tap} from "rxjs";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";

@Component({
	selector: 'app-introduction-create-business-identity-ui-page',
	templateUrl: './introduction.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		AsyncPipe,
		BackLinkComponent,
		LogoutComponent,
		NgIf,
		ChangeLanguageComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class IntroductionCreateBusinessIdentityPage {

	private readonly store = inject(Store);

	@Select(IdentityState.clients)
	private readonly clients$!: Observable<IMember[]>;

	public readonly members$ = this.clients$.pipe(
		tap((members) => {
			if (!members) {
				this.store.dispatch(new IdentityActions.GetClients());
			}
		}),
		filter(Array.isArray),
	);

	public readonly firstCompany$ = this.members$.pipe(
		map((members) => members.length === 0),
	);

	public readonly notFirstCompany$ = this.firstCompany$.pipe(
		map((firstCompany) => !firstCompany),
	);


}

export default IntroductionCreateBusinessIdentityPage;
