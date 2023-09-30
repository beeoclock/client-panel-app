import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {map, tap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
	selector: 'identity-create-business-names-page',
	templateUrl: './index.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		CardComponent,
		NgIf,
		AsyncPipe
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index {
	private readonly activatedRoute = inject(ActivatedRoute);

	public readonly firstCompany$ = this.activatedRoute.queryParams.pipe(
		map(({firstCompany}) => !!firstCompany),
		tap((firstCompany) => {
			if (!firstCompany) {
				this.businessOwnerFullNameControl.clearValidators();
			}
		})
	);

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessNameControl = this.createBusinessQuery.getBusinessNameControl();
	public readonly businessOwnerFullNameControl = this.createBusinessQuery.getBusinessOwnerFullNameControl();

	public get valid(): boolean {
		return this.businessNameControl.valid && this.businessOwnerFullNameControl.valid;
	}

	public get invalid(): boolean {
		return !this.valid;
	}

}
