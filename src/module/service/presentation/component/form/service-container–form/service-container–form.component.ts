import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnInit,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {filter, firstValueFrom, map} from "rxjs";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";

import {Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block/image-block.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {ServicePresentationForm} from "@service/presentation/form/service.presentation.form";
import {MediaTypeEnum} from "@core/shared/enum/media.type.enum";
import {ServicesFormComponent} from "@service/presentation/component/form/v2/service/services.form.component";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {NGXLogger} from "ngx-logger";
import {is} from "@src/core/shared/checker";
import {CurrencyCodeEnum} from "src/core/shared/enum";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IService} from "@src/core/business-logic/service/interface/i.service";

@Component({
	selector: 'service-form-v2-page-component',
	templateUrl: './service-container–form.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		ImageBlockComponent,
		ReactiveFormsModule,
		TranslateModule,
		PricesBlockComponent,
		PrimaryButtonDirective,
		AsyncPipe,
		ButtonSaveContainerComponent,
		ServicesFormComponent,
		FormInputComponent,
		CardComponent,
	]
})
export class ServiceContainerFormComponent implements OnInit {

	readonly imageBlock = viewChild.required(ImageBlockComponent);

	public readonly isEditMode = input(false);

	public readonly item = input<IServiceDto | null>(null);

	public readonly form = new ServiceForm();
	public readonly presentationForm = new ServicePresentationForm({
		banners: [{
			object: 'MediaDto',
			mediaType: MediaTypeEnum.serviceBanner,
			_id: '',
			url: '',
			metadata: {
				object: 'MediaMetadataDto',
				height: 0,
				size: 0,
				width: 0
			},
			state: StateEnum.active,
			stateHistory: [],
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
		const item = this.item();
		if (this.isEditMode() && item) {

			const {durationVersions, languageVersions, presentation, ...rest} = item;

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
			const value = this.form.getRawValue() as unknown as IService.DTO;
			if (this.isEditMode()) {
				await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateItem(value)));
				await this.imageBlock().save(value._id);
			} else {
				await firstValueFrom(this.store.dispatch(new ServiceActions.CreateItem(value)));
				const item = this.item();
				if (item) {
					await this.imageBlock().save(item._id);
				}
			}
			this.form.enable();
			this.form.updateValueAndValidity();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

}
