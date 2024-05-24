import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {filter, map, Observable, tap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {Select, Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {IMember} from "@identity/domain/interface/i.member";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";

@Component({
	selector: 'app-names-create-business-identity-ui-page',
	templateUrl: './names.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CardComponent,
		FormInputComponent,
		TranslateModule,
		BackLinkComponent,
		ChangeLanguageComponent,
		NgIf,
		PrimaryButtonDirective,
		RouterLink,
		AsyncPipe,
		PrimaryLinkButtonDirective,
	],
	encapsulation: ViewEncapsulation.None
})
export class NamesCreateBusinessIdentityPage {

	@Select(IdentityState.clients)
	private readonly clients$!: Observable<IMember[]>;

	private readonly store = inject(Store);

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
		tap((firstCompany) => {
			if (!firstCompany) {
				this.businessOwnerForm.disable();
				this.businessOwnerForm.updateValueAndValidity();
			}
		}),
	);

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessNameControl = this.createBusinessQuery.getBusinessNameControl();
	public readonly businessOwnerForm = this.createBusinessQuery.getBusinessOwnerForm();

	public get valid(): boolean {
		const ifBusinessOwnerEnableUseStatusOfValidation = (this.businessOwnerForm.disabled ? true : this.businessOwnerForm.valid);
		return this.businessNameControl.valid && ifBusinessOwnerEnableUseStatusOfValidation;
	}

	public get invalid(): boolean {
		return !this.valid;
	}
}

export default NamesCreateBusinessIdentityPage;
