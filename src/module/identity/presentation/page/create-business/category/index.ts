import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessCategory} from "@utility/domain/business-category";

@Component({
	selector: 'identity-create-business-category-page',
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
		NgForOf,
		TranslateModule,
		ReactiveFormsModule,
		NgIf
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly businessIndustryControl = this.createBusinessQuery.getBusinessIndustryControl();
	public readonly businessCategoryControl = this.createBusinessQuery.getBusinessCategoryControl();
	public readonly listWithIcon = BusinessCategory.listsByIndustry[this.businessIndustryControl.value];

	public get valid(): boolean {
		return this.businessCategoryControl.valid;
	}

	public get invalid(): boolean {
		return !this.valid;
	}

	public ngOnInit(): void {
		this.businessCategoryControl.valueChanges.subscribe(() => {
			this.router.navigate(['../', 'point-of-sale'], {
				relativeTo: this.activatedRoute
			}).then();
		});
	}

}
