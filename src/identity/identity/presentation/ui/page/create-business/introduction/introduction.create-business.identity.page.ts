import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {BackLinkComponent} from "@shared/presentation/ui/component/link/back.link.component";
import {LogoutComponent} from "@shared/presentation/ui/component/logout/logout.component";
import {filter, map, Observable, tap} from "rxjs";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {IMember} from "@identity/identity/domain/interface/i.member";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";

@Component({
	selector: 'app-introduction-create-business-identity-page',
	templateUrl: './introduction.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		AsyncPipe,
		BackLinkComponent,
		LogoutComponent,
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
