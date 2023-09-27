import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/query/create-business.query";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";
import {ScheduleFormComponent} from "@utility/presentation/component/schedule/schedule.form.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {BooleanState} from "@utility/domain";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {IBusinessClient} from "@identity/domain/interface/i.business.client";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {
	UpdateBusinessProfileApiAdapter
} from "@client/adapter/external/api/buisness-profile/update.business-profile.api.adapter";
import * as Client from "@client/domain";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {IAddress} from "@client/domain/interface/i.address";
import {
	PatchMediaGalleryClientApiAdapter
} from "@client/adapter/external/api/media/gallery/patch.media.gallery.client.api.adapter";
import {CreateServiceApiAdapter} from "@service/adapter/external/api/create.service.api.adapter";

const enum Status {
	Success = 'success',
	InProgress = 'inProgress',
	Failed = 'failed',
	InQueue = 'inQueue',
}

@Component({
	selector: 'identity-create-business-processing-page',
	templateUrl: './index.html',
	standalone: true,
	imports: [
		RouterLink,
		PrimaryLinkButtonDirective,
		FormInputComponent,
		PrimaryButtonDirective,
		BackLinkComponent,
		ChangeLanguageComponent,
		TranslateModule,
		ServiceItemComponent,
		NgForOf,
		CardComponent,
		FormButtonWithIconComponent,
		ScheduleFormComponent,
		NgClass,
		NgIf,
		LoaderComponent
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements AfterViewInit {

	public readonly classes = {
		success: [
			'text-green-700',
			'border-green-300',
			'bg-green-50',
			'dark:border-green-800',
			'dark:text-green-400'
		],
		inProgress: [
			'text-yellow-700',
			'border-yellow-300',
			'bg-yellow-50',
			'dark:border-yellow-800',
			'dark:text-yellow-400'
		],
		failed: [
			'text-red-700',
			'border-red-300',
			'bg-red-50',
			'dark:border-red-800',
			'dark:text-red-400'
		],
		inQueue: [
			'text-blue-700',
			'border-blue-300',
			'bg-blue-50',
			'dark:border-blue-800',
			'dark:text-blue-400'
		],
	}

	private readonly logger = inject(NGXLogger);
	private readonly createServiceApiAdapter = inject(CreateServiceApiAdapter);
	private readonly updateBusinessProfileApiAdapter = inject(UpdateBusinessProfileApiAdapter);
	public readonly patchMediaGalleryClientApiAdapter = inject(PatchMediaGalleryClientApiAdapter);
	private readonly translateService = inject(TranslateService);
	private readonly createBusinessQuery = inject(CreateBusinessQuery);
	public readonly identityApiAdapter = inject(IdentityApiAdapter);
	public readonly store = inject(Store);
	public readonly allStepsFinishedWithSuccess = new BooleanState(false);

	public readonly steps = [
		{
			title: this.translateService.instant('keyword.capitalize.business'),
			status: Status.InQueue,
			method: this.stepCreateBusiness.bind(this),
		},
		{
			title: this.translateService.instant('keyword.capitalize.businessProfile'),
			status: Status.InQueue,
			method: this.stepAddBusinessProfile.bind(this),
		},
		{
			title: this.translateService.instant('keyword.capitalize.portfolio'),
			status: Status.InQueue,
			method: this.stepAddGallery.bind(this),
		},
		{
			title: this.translateService.instant('keyword.capitalize.services'),
			status: Status.InQueue,
			method: this.stepAddServices.bind(this),
		},
	];


	public async ngAfterViewInit(): Promise<void> {
		let isAllStepsFinishedWithSuccess = true;
		for (let i = 0; i < this.steps.length; i++) {
			isAllStepsFinishedWithSuccess = false;
			const step = this.steps[i];
			step.status = Status.InProgress;
			try {
				await step.method();
				step.status = Status.Success;
				isAllStepsFinishedWithSuccess = true;
			} catch (e) {
				console.log(e);
				step.status = Status.Failed;
				return;
			}
		}
		if (isAllStepsFinishedWithSuccess) {
			this.allStepsFinishedWithSuccess.switchOn();
			this.createBusinessQuery.clear();
		}
	}

	private async stepCreateBusiness(): Promise<void> {
		try {
			this.logger.debug('stepCreateBusiness');
			const body: IBusinessClient = {
				name: this.createBusinessQuery.getBusinessNameControl().value,
				businessCategory: this.createBusinessQuery.getBusinessCategoryControl().value,
				businessIndustry: this.createBusinessQuery.getBusinessIndustryControl().value,
				serviceProvideType: this.createBusinessQuery.getServiceProvideTypeControl().value,
			};
			this.logger.debug('stepCreateBusiness:body', body);

			const request$ = this.identityApiAdapter.postCreateBusinessClient$(body);
			const {id: clientId} = await firstValueFrom(request$);
			this.logger.debug('stepCreateBusiness:clientId', clientId);

			const requestToSwitchContext$ = this.identityApiAdapter.patchSwitchBusinessClient$({clientId});
			await firstValueFrom(requestToSwitchContext$);
			this.logger.debug('stepCreateBusiness:context switched');

			// Refresh token and receive new claims
			await firstValueFrom(this.store.dispatch(new IdentityActions.InitToken()));
			this.logger.debug('stepCreateBusiness:done');
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	private async stepAddBusinessProfile(): Promise<void> {
		let body: Client.IClient = {
			schedules: this.createBusinessQuery.getSchedulesForm().value,
		}
		if (this.createBusinessQuery.getServiceProvideTypeControl().value !== ServiceProvideTypeEnum.Online) {
			body = {
				...body,
				addresses: [this.createBusinessQuery.getAddressForm().value as IAddress],
			};
		}
		await this.updateBusinessProfileApiAdapter.executeAsync(body);
	}

	private async stepAddGallery(): Promise<void> {

		const requestList$ = this.createBusinessQuery.getGalleryForm().value.images
			?.filter((media) => media?.length)
			.map((media) => {
				return this.patchMediaGalleryClientApiAdapter.executeAsync({media});
			});

		if (!requestList$) {
			return;
		}

		await Promise.all(requestList$);

	}

	private async stepAddServices(): Promise<void> {

		const requestList$ = this.createBusinessQuery.getServicesForm().value?.map((service) => {
			return this.createServiceApiAdapter.executeAsync(service);
		});

		if (!requestList$) {
			return;
		}

		await Promise.all(requestList$);
	}

}
