import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {filter, firstValueFrom, map} from "rxjs";
import {ServiceActions} from "@service/state/service/service.actions";
import {IService} from "@service/domain";
import {Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block/image-block.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {
	SwitchActiveBlockComponent
} from "@utility/presentation/component/switch/switch-active/switch-active-block.component";
import {ServicePresentationForm} from "@service/presentation/form/service.presentation.form";
import {MediaTypeEnum} from "@utility/domain/enum/media.type.enum";
import {ServicesFormComponent} from "@service/presentation/component/form/v2/service/services.form.component";
import {ClientState} from "@client/state/client/client.state";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NGXLogger} from "ngx-logger";
import {
	ServiceFormImageComponent
} from "@service/presentation/component/form/v2/image/service-form-image/service-form-image.component";
import {is} from "thiis";
import {CurrencyCodeEnum} from "@utility/domain/enum";

@Component({
	selector: 'service-form-v2-page-component',
	templateUrl: './service-container–form.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgIf,
		ImageBlockComponent,
		ReactiveFormsModule,
		TranslateModule,
		DetailsBlockComponent,
		PricesBlockComponent,
		SwitchActiveBlockComponent,
		PrimaryButtonDirective,
		AsyncPipe,
		ButtonSaveContainerComponent,
		ServicesFormComponent,
		FormInputComponent,
		CardComponent,
		ServiceFormImageComponent,
	]
})
export class ServiceContainerFormComponent implements OnInit {

	@ViewChild(ImageBlockComponent)
	public readonly imageBlock!: ImageBlockComponent;

	@Input()
	public isEditMode = false;

	@Input()
	public item: IService | null = null;

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

	public readonly currencyList$ = this.store.select(ClientState.baseCurrency).pipe(
		filter(is.not_undefined<CurrencyCodeEnum>),
		map((currency) => [currency]),
		map((currencies) => {
			return currencies.map((currency) => ({
				id: currency,
				name: currency
			}));
		}),
	);

	// public readonly currencyList$ = this.store.select(ClientState.currencies).pipe(
	// 	map((currencies) => {
	// 		if (!currencies) {
	// 			return Object.values(CurrencyCodeEnum);
	// 		}
	// 		return currencies;
	// 	}),
	// 	tap((currencies) => {
	// 		this.updateValue(currencies);
	// 	}),
	// 	map((currencies) => {
	// 		return currencies.map((currency) => ({
	// 			id: currency,
	// 			name: currency
	// 		}));
	// 	}),
	// );

	public readonly availableLanguages$ = this.store.select(ClientState.availableLanguages);

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		if (this.isEditMode && this.item) {

			const {durationVersions, languageVersions, presentation, ...rest} = this.item;

			if (presentation?.banners?.length) {
				this.presentationForm.controls.banners.patchValue(presentation.banners);
			}

			this.form.patchValue(rest);

			if (presentation?.color) {
				this.form.controls.presentation.controls.color.setValue(presentation.color);
			}

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
	}

	public async save(): Promise<void> {

		this.form.markAllAsTouched();
		this.form.updateValueAndValidity();
		if (this.form.valid
		) {
			this.form.disable();
			this.form.markAsPending();
			const value = this.form.getRawValue() as IService;
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateItem(value)));
				await this.imageBlock.save(value._id);
			} else {
				await firstValueFrom(this.store.dispatch(new ServiceActions.CreateItem(value)));
				if (this.item) {
					await this.imageBlock.save(this.item._id);
				}
			}
			this.form.enable();
			this.form.updateValueAndValidity();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

}
