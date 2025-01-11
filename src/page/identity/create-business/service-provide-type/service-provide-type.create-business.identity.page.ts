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
import {ServiceProvideType} from "@utility/domain/service-provide-type";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'app-service-provide-type-create-business-identity-page',
	templateUrl: './service-provide-type.create-business.identity.page.html',
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
export class ServiceProvideTypeCreateBusinessIdentityPage extends Reactive implements OnInit {

	public readonly listWithIcon = ServiceProvideType.listWithIcon;
	public nextStepPath = 'point-of-sale';
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly serviceProvideTypeControl = this.createBusinessQuery.getServiceProvideTypeControl();

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
			const commands = ['../', this.nextStepPath];
			this.router.navigate(commands, {
				relativeTo: this.activatedRoute
			}).then();
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

export default ServiceProvideTypeCreateBusinessIdentityPage;
