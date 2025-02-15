import {Component, inject, input, OnInit} from "@angular/core";

import {FormControl, Validators} from "@angular/forms";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {AsyncPipe, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {DurationSelectComponent} from "@utility/presentation/component/input/duration.select.component";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/price-and-currency.component";
import {NGXLogger} from "ngx-logger";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {filter, firstValueFrom, map, merge, Subscription} from "rxjs";
import {Reactive} from "@utility/cdk/reactive";
import {Store} from "@ngxs/store";
import {ClientState} from "@client/state/client/client.state";
import {is} from "../../../../../../../../core/shared/checker";
import {IServiceDto} from "../../../../../../../../core/business-logic/order/interface/i.service.dto";

@Component({
	selector: 'event-duration-version-type-range',
	templateUrl: 'duration-version-type.range.component.html',
	standalone: true,
	imports: [
		CardComponent,
		AsyncPipe,
		TranslateModule,
		NgSwitch,
		NgSwitchCase,
		NgTemplateOutlet,
		DurationSelectComponent,
		PriceAndCurrencyComponent
	]
})
export class DurationVersionTypeRangeComponent extends Reactive implements OnInit {

	public readonly service = input.required<IServiceDto>();

	public readonly serviceListControl = input.required<FormControl<IServiceDto[]>>();

	public readonly index = input.required<number>();

	public readonly variantList: {
		price: {
			showOnlyValue: boolean;
			control: FormControl<number | null>;
		};
		currency: {
			showOnlyValue: boolean;
			control: FormControl<string | null>;
		},
		duration: {
			showOnlyValue: boolean;
			control: FormControl<number | null>;
		};
	}[] = [];

	private readonly logger = inject(NGXLogger);
	private readonly store = inject(Store);

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
	public readonly baseCurrency$ = this.store.select(ClientState.item).pipe(
		map((item) => {
			return item?.businessSettings?.baseCurrency;
		})
	);
	private selectedVariantIndex = -1;
	private handler: Subscription | undefined;

	public get selectedVariant() {
		return this.variantList[this.selectedVariantIndex];
	}

	public ngOnInit() {
		this.logger.debug('ngOnInit');
		this.buildVariants();
	}

	public isSelected(index: number): boolean {
		return this.selectedVariantIndex === index;
	}

	public async buildVariants() {
		this.logger.debug('buildVariants');

		// Clear previous variants
		this.variantList.length = 0;

		// By forEach
		// this.service.durationVersions.forEach((durationVersion) => {
		// });

		const lastDurationVersion = this.service().durationVersions[this.service().durationVersions.length - 1];
		const durationVersion = lastDurationVersion;

		// Price
		const price = durationVersion.prices[0].price || null;
		const showOnlyValueOfPrice = price !== null;

		// Currency
		const baseCurrency = await firstValueFrom(this.baseCurrency$.pipe(this.takeUntil()));
		const currency = durationVersion.prices[0].currency || baseCurrency || null;
		const showOnlyValueOfCurrency = currency !== null;

		// Duration
		const duration = durationVersion.durationInSeconds;
		const showOnlyValueOfDuration = duration !== null;

		this.variantList.push({
			price: {
				showOnlyValue: showOnlyValueOfPrice,
				control: new FormControl(price),
			},
			currency: {
				showOnlyValue: showOnlyValueOfCurrency,
				control: new FormControl(currency),
			},
			duration: {
				showOnlyValue: showOnlyValueOfDuration,
				control: new FormControl(duration),
			}
		});

		this.logger.debug('buildVariants', this.variantList);

		this.selectVariant(this.variantList.length - 1);
	}

	public selectVariant(index: number): void {
		// Check if selected variant is not the same
		if (this.selectedVariantIndex === index) {
			return;
		}
		this.logger.debug('selectVariant', index);
		if (this.selectedVariantIndex !== -1) {
			this.clearValidations();
			this.deleteHandlers();
		}
		this.selectedVariantIndex = index;
		this.setValidations();
		this.initHandlers();
		this.setToService();
	}

	public checkIfSelectedVariantIsValid(): boolean {
		this.logger.debug('checkIfSelectedVariantIsValid');
		const variant = this.selectedVariant;
		variant.duration.control.markAllAsTouched();
		variant.duration.control.updateValueAndValidity();
		return variant.duration.control.valid;
	}

	private setToService(): void {
		this.logger.debug('setToService');
		// Delete all existing duration versions in service and push selected variant
		const {duration, price, currency} = this.selectedVariant;

		// Check if duration version is already exists
		const service = this.service();
		if (service.durationVersions.length) {
			const [firstDurationVersion] = service.durationVersions;
			const durationIsSame = firstDurationVersion.durationInSeconds === duration.control.value;
			const priceIsSame = firstDurationVersion.prices[0].price === price.control.value;
			const currencyIsSame = firstDurationVersion.prices[0].currency === currency.control.value;
			const allIsSame = durationIsSame && priceIsSame && currencyIsSame;
			if (allIsSame) {
				return;
			}
		}

		Object.defineProperties(service, {
			durationVersions: {
				value: [
					{
						breakInSeconds: 0,
						durationInSeconds: duration.control.value ?? 0,
						prices: [{
							price: price.control.value ?? 0,
							// TODO add default currency in environment and in business profile
							currency: (currency.control.value || CurrencyCodeEnum.UAH) as CurrencyCodeEnum,
						}]
					}
				],
				// 👉️ must be set writable: true
				// writable: true, // 👈️ uncomment this
			},
		});

		this.updateServiceListControl();
		this.logger.debug('setToService:result', service);
	}

	private updateServiceListControl(): void {
		this.logger.debug('updateServiceListControl');
		// Update service in service list control
		this.serviceListControl().patchValue(this.serviceListControl().value);
	}

	private clearValidations(): void {
		this.logger.debug('clearValidations');
		this.selectedVariant.price.control.clearValidators();
		this.selectedVariant.duration.control.clearValidators();
	}

	private setValidations(): void {
		this.logger.debug('setValidations');
		this.selectedVariant.price.control.setValidators([]);
		this.selectedVariant.duration.control.setValidators([
			Validators.required,
		]);
	}

	private deleteHandlers(): void {
		this.logger.debug('deleteHandlers');
		if (this.handler) {
			this.handler.unsubscribe();
		}
	}

	private initHandlers(): void {
		this.logger.debug('initHandlers', this.selectedVariant);
		this.handler = merge(
			this.selectedVariant.duration.control.valueChanges,
			this.selectedVariant.price.control.valueChanges,
			this.selectedVariant.currency.control.valueChanges,
		)
			.pipe(
				this.takeUntil(),
			)
			.subscribe((value) => {
				this.logger.debug('initHandlers:valueChanges', value);
				this.setToService();
			});
	}

}
