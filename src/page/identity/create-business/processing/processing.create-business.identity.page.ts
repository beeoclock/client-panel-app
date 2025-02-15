import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CreateBusinessQuery} from "@identity/infrastructure/query/create-business.query";
import {NgClass} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {BooleanState} from "@utility/domain";
import {IdentityApiAdapter} from "@identity/infrastructure/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {IBusinessClient} from "@identity/domain/interface/RIBusinessClient";
import {IdentityActions} from "@identity/infrastructure/state/identity/identity.actions";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {
	UpdateBusinessProfileApiAdapter
} from "@client/infrastructure/adapter/api/buisness-profile/update.business-profile.api.adapter";
import * as Client from "@client/domain";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {IAddress} from "@client/domain/interface/i.address";
import {
	PatchMediaGalleryClientApiAdapter
} from "@client/infrastructure/adapter/api/media/gallery/patch.media.gallery.client.api.adapter";
import {CreateServiceApiAdapter} from "@service/infrastructure/api/create.service.api.adapter";

import {TENANT_ID} from "@src/token";
import {WithTenantIdPipe} from "@utility/presentation/pipes/with-tenant-id.pipe";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {
	ModalSelectSpecialistListRepository
} from "@member/infrastructure/repository/modal-select-specialist.list.repository";

const enum Status {
	Success = 'success',
	InProgress = 'inProgress',
	Failed = 'failed',
	InQueue = 'inQueue',
}

@Component({
	selector: 'app-processing-create-business-identity-page',
	templateUrl: './processing.create-business.identity.page.html',
	standalone: true,
	imports: [
		RouterLink,
		PrimaryButtonDirective,
		TranslateModule,
		CardComponent,
		NgClass,
		LoaderComponent,
		WithTenantIdPipe
	],
	encapsulation: ViewEncapsulation.None
})
export class ProcessingCreateBusinessIdentityPage implements AfterViewInit {

	readonly goToDashboardPage = viewChild.required<ElementRef<HTMLButtonElement>>('goToDashboardPage');

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
	public readonly patchMediaGalleryClientApiAdapter = inject(PatchMediaGalleryClientApiAdapter);
	public readonly identityApiAdapter = inject(IdentityApiAdapter);
	public readonly store = inject(Store);
	public readonly tenantId$ = inject(TENANT_ID);
	public readonly allStepsFinishedWithSuccess = new BooleanState(false);
	public readonly modalSelectSpecialistListRepository = inject(ModalSelectSpecialistListRepository);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly createServiceApiAdapter = inject(CreateServiceApiAdapter);
	private readonly updateBusinessProfileApiAdapter = inject(UpdateBusinessProfileApiAdapter);
	private readonly translateService = inject(TranslateService);
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
			title: this.translateService.instant('keyword.capitalize.businessSettings'),
			status: Status.InQueue,
			method: this.stepAddBusinessSettings.bind(this),
		},
		// {
		// 	title: this.translateService.instant('keyword.capitalize.portfolio'),
		// 	status: Status.InQueue,
		// 	method: this.stepAddGallery.bind(this),
		// },
		{
			title: this.translateService.instant('keyword.capitalize.services'),
			status: Status.InQueue,
			method: this.stepAddServices.bind(this),
		},
	];
	private readonly createBusinessQuery = inject(CreateBusinessQuery);

	public async ngAfterViewInit(): Promise<void> {
		let isAllStepsFinishedWithSuccess = true;
		try {

			for (let i = 0; i < this.steps.length; i++) {
				const step = this.steps[i];
				try {
					isAllStepsFinishedWithSuccess = false;

					step.status = Status.InProgress;
					this.changeDetectorRef.detectChanges();

					await step.method();

					step.status = Status.Success;

					this.changeDetectorRef.detectChanges();
					isAllStepsFinishedWithSuccess = true;

				} catch (e) {

					this.ngxLogger.error(e);
					step.status = Status.Failed;
					this.changeDetectorRef.detectChanges();
					throw e;
					return;

				}
			}

			if (isAllStepsFinishedWithSuccess) {
				this.allStepsFinishedWithSuccess.switchOn();
				this.createBusinessQuery.initForm();
				setTimeout(() => {
					this.goToDashboardPage().nativeElement.click();
				}, 1_000);
			}

		} catch (e) {
			this.ngxLogger.error(e);
		}
		this.changeDetectorRef.detectChanges();
	}

	private async stepCreateBusiness(): Promise<void> {
		try {
			this.ngxLogger.debug('stepCreateBusiness');
			const serviceProvideType = this.createBusinessQuery.getServiceProvideTypeControl().value;
			const businessCategory = this.createBusinessQuery.getBusinessCategoryControl().value;
			const bookingSettings = this.createBusinessQuery.getBookingSettingsControl().value;
			const businessOwner = this.createBusinessQuery.getBusinessOwnerForm().value;
			const body: IBusinessClient = {
				name: this.createBusinessQuery.getBusinessNameControl().value,
				businessIndustry: this.createBusinessQuery.getBusinessIndustryControl().value,
			};

			if (businessOwner) {
				body.businessOwner = businessOwner;
			}

			if (serviceProvideType) {
				body.serviceProvideType = serviceProvideType;
			}

			if (businessCategory) {
				body.businessCategory = businessCategory;
			}

			if (bookingSettings) {
				body.bookingSettings = bookingSettings as any;
			}

			this.ngxLogger.debug('stepCreateBusiness:body', body);

			const request$ = this.identityApiAdapter.postCreateBusinessClient$(body);
			const {id: tenantId} = await firstValueFrom(request$);
			this.ngxLogger.debug('stepCreateBusiness:tenantId', tenantId);

			this.tenantId$.next(tenantId);
			this.ngxLogger.debug('stepCreateBusiness:context switched');

			// Refresh token and receive new claims
			await firstValueFrom(this.store.dispatch(new IdentityActions.InitToken()));
			this.ngxLogger.debug('stepCreateBusiness:done');

		} catch (e) {
			this.ngxLogger.error(e);
			throw e;
		}
	}

	private async stepAddBusinessProfile(): Promise<void> {
		const tenantId = this.tenantId$.value as string;
		let body: Client.IClient = {
			_id: tenantId,
			schedules: this.createBusinessQuery.getSchedulesForm().value,
			published: this.createBusinessQuery.publishedControl().value
		}
		if (this.createBusinessQuery.getServiceProvideTypeControl().value !== ServiceProvideTypeEnum.Online) {
			body = {
				...body,
				addresses: [this.createBusinessQuery.getAddressForm().value as IAddress],
			};
		}
		await this.updateBusinessProfileApiAdapter.executeAsync(body);
	}

	private async stepAddBusinessSettings(): Promise<void> {
		const tenantId = this.tenantId$.value as string;
		const body: Client.IClient = {
			_id: tenantId,
			businessSettings: this.createBusinessQuery.getBusinessSettings().value,
		}
		await this.updateBusinessProfileApiAdapter.executeAsync(body);
	}

	private async stepAddGallery(): Promise<void> {

		const requestList$ = this.createBusinessQuery.getGalleryForm().value.images
			?.filter((media) => (media?.size ?? 0) > 0)
			.map((media) => {
				const formData = new FormData();
				formData.append('file', media);
				return this.patchMediaGalleryClientApiAdapter.executeAsync(formData);
			});

		if (!requestList$) {
			return;
		}

		await Promise.all(requestList$);

	}

	private async stepAddServices(): Promise<void> {

		if (!this.modalSelectSpecialistListRepository.tableState.total) {

			this.modalSelectSpecialistListRepository.resetTableState();
			await this.modalSelectSpecialistListRepository.getPageAsync();

		}

		const requestList$ = this.createBusinessQuery.getServicesForm()
			.value?.map((service) => {
				return this.createServiceApiAdapter.executeAsync(service as IServiceDto);
			});

		if (!requestList$) {
			return;
		}

		await Promise.all(requestList$);
	}

}

export default ProcessingCreateBusinessIdentityPage;
