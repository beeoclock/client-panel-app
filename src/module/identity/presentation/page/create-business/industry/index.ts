import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {BusinessIndustry} from "@utility/domain/business-industry";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'identity-create-business-industry-page',
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
		ReactiveFormsModule
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index extends Reactive implements OnInit {

	private readonly createBusinessQuery = inject(CreateBusinessQuery);
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
