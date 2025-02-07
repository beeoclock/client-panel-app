import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/infrastructure/query/create-business.query";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessCategory} from "@utility/domain/business-category";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'app-category-create-business-identity-page',
	templateUrl: './category.create-business.identity.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		RouterLink,
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
export class CategoryCreateBusinessIdentityPage extends Reactive implements OnInit {

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
		this.businessCategoryControl.valueChanges.pipe(this.takeUntil()).subscribe(() => {
			this.router.navigate(['../', 'point-of-sale'], {
				relativeTo: this.activatedRoute
			}).then();
		});
	}

}

export default CategoryCreateBusinessIdentityPage;
