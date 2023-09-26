import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {ServiceProvideType} from "@utility/domain/service-provide-type";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'identity-create-business-service-provide-type-page',
	templateUrl: 'index.html',
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
	public readonly serviceProvideTypeControl = this.createBusinessQuery.getServiceProvideTypeControl();
	public readonly listWithIcon = ServiceProvideType.listWithIcon;

	public nextStepPath = 'point-of-sale';

	constructor() {
		super();
	}

	public get valid(): boolean {
		return this.serviceProvideTypeControl.valid;
	}

	public get invalid(): boolean {
		return !this.valid;
	}

	public ngOnInit(): void {
		this.updateNextStepPath(this.serviceProvideTypeControl.value);
		this.serviceProvideTypeControl.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			this.updateNextStepPath(value);
		});
	}

	private updateNextStepPath(value: ServiceProvideTypeEnum) {
		switch (value) {
			case ServiceProvideTypeEnum.Online:
				this.nextStepPath = 'schedules';
				break;
			default:
				this.nextStepPath = 'point-of-sale';
		}
	}

}