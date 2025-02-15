import {Injectable, OnDestroy} from "@angular/core";
import CreateBusinessForm from "@identity/presentation/form/create-business.form";
import {NGXLogger} from "ngx-logger";
import {TranslateService} from "@ngx-translate/core";
import {LanguageCodeEnum} from "src/core/shared/enum";
import {LanguageCountry} from "@utility/domain/const/c.language-country";
import {LanguageCurrency} from "@utility/domain/const/c.language-currency";
import {BooleanState} from "@utility/domain";

import {RISchedule} from "@utility/domain/interface/i.schedule";
import {Reactive} from "@utility/cdk/reactive";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";

@Injectable()
export class CreateBusinessFormRepository extends Reactive implements OnDestroy {

	readonly #form = new CreateBusinessForm();
	public readonly formLocalStorageKey = 'create-business-form';
	public readonly initializedValueFromStorage = new BooleanState(false);

	constructor(
		private readonly logger: NGXLogger,
		private readonly translateService: TranslateService,
	) {
		super();
		if (this.initializedValueFromStorage.isOff) {
			this.initValueFromLocalStorage();
		}
		this.initHandlers();
	}

	public initForm(): void {
		this.logger.debug('CreateBusinessFormRepository.initForm');
		this.#form.reset()
		this.clearLocalStorage();
	}

	public get form(): CreateBusinessForm {
		return this.#form;
	}

	public initValueFromLocalStorage(): void {
		this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage');
		const value = localStorage.getItem(this.formLocalStorageKey);
		if (value) {
			const parsedValue = JSON.parse(value) as {
				schedules: RISchedule[],
				services: IServiceDto[],
				// gallery: { object: string; images: string[] }
			};

			this.logger.debug('CreateBusinessFormRepository.initValueFromLocalStorage', parsedValue);
			const {
				schedules,
				// gallery,
				services,
				...restOfForm
			} = parsedValue;
			this.form.patchValue(restOfForm);

			// Schedules
			if (schedules.length) {
				this.form.controls.schedules.clear();
				schedules.forEach((schedule) => {
					this.form.controls.schedules.pushNewOne(schedule);
				});
			}

			// Gallery
			// if (gallery.images.length) {
			// 	this.form.controls.gallery.controls.images.clear();
			// 	gallery.images.forEach((image) => {
			// 		this.form.controls.gallery.pushImage(image);
			// 	});
			// }

			// Services
			if (services.length) {
				this.form.controls.services.clear();
				services.forEach((service) => {
					this.form.controls.services.pushNewOne(service);
				});
			}

		}
		this.initializedValueFromStorage.switchOn();
	}

	public clearLocalStorage(): void {
		localStorage.removeItem(this.formLocalStorageKey);
	}

	private initHandlers(): void {
		this.logger.debug('CreateBusinessFormRepository.initHandlers');
		this.initFormValueHandler();

		this.#form.controls.businessSettings.controls.availableLanguages.valueChanges.pipe(
			this.takeUntil(),
		).subscribe((value) => {
			this.logger.debug('CreateBusinessFormRepository.initHandlers.#form.controls.businessSettings.controls.availableLanguages.valueChanges', value);
			if (value.length) {
				this.#form.controls.businessSettings.controls.baseLanguage.patchValue(value[0]);
			} else {
				this.#form.controls.businessSettings.controls.baseLanguage.reset();
			}
		});

		this.initDefaultValuePeerLanguage();

		this.translateService.onLangChange.subscribe(() => {
			this.initDefaultValuePeerLanguage();
		});

	}

	private initDefaultValuePeerLanguage() {

		const languageCode = this.translateService.currentLang as LanguageCodeEnum;
		this.#form.controls.businessSettings.controls.availableLanguages.setValue([languageCode]);
		this.#form.controls.addressForm.controls.country.patchValue(LanguageCountry[languageCode][0]);
		this.#form.controls.businessSettings.controls.baseCurrency.patchValue(LanguageCurrency[languageCode]);
		this.#form.controls.businessSettings.controls.currencies.patchValue([LanguageCurrency[languageCode]]);

	}

	private initFormValueHandler(): void {
		this.form.valueChanges.subscribe((value) => {
			this.logger.debug('CreateBusinessFormRepository.initFormValueHandler.form.valueChanges', value);
			this.saveToStorage();
		});
	}

	public saveToStorage(): void {
		localStorage.setItem(this.formLocalStorageKey, JSON.stringify(this.form.getRawValue()));
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.form.destroyHandlers();
	}

}
