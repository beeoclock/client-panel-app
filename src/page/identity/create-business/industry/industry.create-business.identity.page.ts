import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {BusinessIndustry} from "@utility/domain/business-industry";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'app-industry-create-business-identity-ui-page',
	templateUrl: './industry.create-business.identity.page.html',
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
export class IndustryCreateBusinessIdentityPage extends Reactive implements OnInit {

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	public readonly businessIndustryControl = this.createBusinessQuery.getBusinessIndustryControl();
	public readonly industryListWithIcon = BusinessIndustry.listWithIcon;
	public nextStepPath = 'category';

	constructor() {
		super();
	}

	public ngOnInit(): void {
		this.updateNextStepPath(this.businessIndustryControl.value);
		this.businessIndustryControl.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			this.updateNextStepPath(value);
			const commands = ['../', this.nextStepPath];
			this.router.navigate(commands, {
				relativeTo: this.activatedRoute
			}).then();
		});
	}

	public get valid(): boolean {
		return this.businessIndustryControl.valid;
	}

	public get invalid(): boolean {
		return !this.valid;
	}

	private updateNextStepPath(value: BusinessIndustryEnum) {
		switch (value) {
			case BusinessIndustryEnum.BeautyIndustry:
				this.nextStepPath = 'category';
				break;
			case BusinessIndustryEnum.TeachingAndConsultation:
				this.nextStepPath = 'service-provide-type';
				break;
			case BusinessIndustryEnum.Healthcare:
				this.nextStepPath = 'category';
				break;
			case BusinessIndustryEnum.Other:
				this.nextStepPath = 'point-of-sale';
				break;
		}
	}
}


export default IndustryCreateBusinessIdentityPage;
