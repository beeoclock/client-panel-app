import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyCodeEnum, LanguageCodeEnum} from "src/core/shared/enum";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

/**
 * Interface representing the structure of the Business Settings form.
 */
export interface IBusinessSettingsForm {
  object: FormControl<'BusinessSettings'>;
  timeZone: FormControl<string>;
  availableLanguages: FormControl<LanguageCodeEnum[]>;
  baseLanguage: FormControl<LanguageCodeEnum>;
  emailLanguage: FormControl<LanguageCodeEnum>;
  currencies: FormControl<CurrencyCodeEnum[]>;
  baseCurrency: FormControl<CurrencyCodeEnum>;
}

/**
 * Form group class for managing business settings.
 */
export class BusinessSettingsForm extends FormGroup<IBusinessSettingsForm> {

  /**
   * Subject to handle unsubscription for base currency value changes.
   */
  private readonly takeUntilBaseCurrency$ = new Subject<void>();

  /**
   * Constructor to initialize the form controls and set up validators and handlers.
   */
  constructor() {
    super({
      object: new FormControl('BusinessSettings', {
        nonNullable: true,
      }),
      timeZone: new FormControl(Intl.DateTimeFormat().resolvedOptions().timeZone, {
        nonNullable: true,
      }),
      availableLanguages: new FormControl([LanguageCodeEnum.en], {
        nonNullable: true,
      }),
      baseLanguage: new FormControl(),
      currencies: new FormControl([], {
        nonNullable: true,
      }),
      baseCurrency: new FormControl(),
      emailLanguage: new FormControl(LanguageCodeEnum.en, {
        nonNullable: true,
      }),
    });

    this.initValidators();
    this.initHandlers();
  }

  /**
   * Initializes validators for the form controls.
   */
  private initValidators(): void {
    this.controls.timeZone.setValidators(Validators.required);
    this.controls.baseLanguage.setValidators([Validators.required]);
    this.controls.emailLanguage.setValidators([Validators.required]);
    this.controls.availableLanguages.setValidators([Validators.required, Validators.minLength(1)]);
    this.controls.currencies.setValidators([Validators.required, Validators.minLength(1)]);
    this.controls.baseCurrency.setValidators([Validators.required]);
  }

  /**
   * Initializes handlers for form control value changes.
   */
  private initHandlers(): void {
    this.controls.baseCurrency.valueChanges.pipe(takeUntil(this.takeUntilBaseCurrency$)).subscribe((baseCurrency) => {
      this.controls.currencies.setValue([baseCurrency]);
    });
  }

  /**
   * Destroys the form and completes the unsubscription subject.
   */
  public destroy(): void {
    this.takeUntilBaseCurrency$.next();
    this.takeUntilBaseCurrency$.complete();
  }
}
