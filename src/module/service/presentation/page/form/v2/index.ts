import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {
	SpecialistsBlockComponent
} from "@service/presentation/component/form/v2/specialists/specialists-block.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {filter, firstValueFrom, Observable} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {IService} from "@service/domain";
import {Select, Store} from "@ngxs/store";
import {ServiceState} from "@service/state/service/service.state";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block/image-block.component";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {
	SwitchActiveBlockComponent
} from "@utility/presentation/component/switch/switch-active/switch-active-block.component";
import {ServicePresentationForm} from "@service/presentation/form/service.presentation.form";
import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {ServicesFormComponent} from "@service/presentation/component/form/v1/service/services.form.component";
import {ClientState} from "@client/state/client/client.state";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'service-form-v2-page-component',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		BackLinkComponent,
		NgIf,
		ImageBlockComponent,
		ReactiveFormsModule,
		TranslateModule,
		DetailsBlockComponent,
		PricesBlockComponent,
		SpecialistsBlockComponent,
		SwitchActiveBlockComponent,
		PrimaryButtonDirective,
		AsyncPipe,
		BackButtonComponent,
		DefaultPanelComponent,
		ButtonSaveContainerComponent,
		ServicesFormComponent,
		FormInputComponent,
		CardComponent,
	]
})
export default class Index implements OnInit {

	@ViewChild(ImageBlockComponent)
	public readonly imageBlock!: ImageBlockComponent;

	@ViewChild(BackButtonComponent)
	public backButtonComponent!: BackButtonComponent;

	public readonly form = new ServiceForm();
	public readonly presentationForm = new ServicePresentationForm({
		_id: '',
		createdAt: '',
		updatedAt: '',
		object: 'Service.Presentation',
		banners: [{
			object: 'Media',
			mediaType: MediaTypeEnum.serviceBanner,
			_id: '',
			url: '',
			createdAt: '',
			updatedAt: '',
		}]
	});

	public readonly store = inject(Store);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly router = inject(Router);
	public readonly ngxLogger = inject(NGXLogger);

	@Select(ServiceState.itemData)
	public itemData$!: Observable<IService | undefined>;

	public readonly availableLanguages$ = this.store.select(ClientState.availableLanguages);

	private isEditMode = false;

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
			firstValueFrom(this.itemData$).then((result) => {
				if (result) {
					this.isEditMode = true;

					const {durationVersions, languageVersions, presentation, ...rest} = result;

					if (presentation) {
						this.presentationForm.patchValue(presentation);
					}

					this.form.patchValue(rest);

					if (durationVersions) {

						// Prevents from removing all controls from durationVersions
						this.form.controls.durationVersions.clear();
						// Add new controls to durationVersions
						durationVersions.forEach((durationVersion) => {
							this.form.controls.durationVersions.pushNewOne(durationVersion);
						});

					}

					if (languageVersions) {

						// Prevents from removing all controls from languageVersions
						this.form.controls.languageVersions.clear();
						// Add new controls to languageVersions
						languageVersions.forEach((languageVersion) => {
							this.form.controls.languageVersions.pushNewOne(languageVersion);
						});

					}

					this.form.updateValueAndValidity();
					this.changeDetectorRef.detectChanges();
				}
			});
		});
	}

	public async save(): Promise<void> {

		this.form.markAllAsTouched();
		this.form.updateValueAndValidity();
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const value = this.form.getRawValue() as IService;
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateItem(value)));
				await this.imageBlock.save(value._id);
			} else {
				await firstValueFrom(this.store.dispatch(new ServiceActions.CreateItem(value)));
				const item = await firstValueFrom(this.itemData$);
				if (item && item._id) {
					await this.imageBlock.save(item._id);
				}
			}
			await this.backButtonComponent.navigateToBack();
			this.form.enable();
			this.form.updateValueAndValidity();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

}
