import {inject, Injectable} from "@angular/core";

import {DurationHelper} from "@utility/helper/duration.helper";
import {TranslateService} from "@ngx-translate/core";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";
import {CurrencyPipe} from "@angular/common";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {BASE_CURRENCY} from "@src/token";

@Injectable()
export class DurationVersionHtmlHelper {

	private readonly durationHelper = inject(DurationHelper);
	private readonly translateService = inject(TranslateService);
	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);
	private readonly currencyPipe = inject(CurrencyPipe);
	private readonly baseCurrency = inject(BASE_CURRENCY);

	public getDurationValue(item: IServiceDto): string {
		const {durationVersions} = item;
		if (this.durationHelper.durationIsRangeMode(item) && durationVersions.length > 1) {
			const translateKeyFrom = 'keyword.capitalize.from';
			const fromLabel = this.translateService.instant(translateKeyFrom);
			const translateKeyTo = 'keyword.capitalize.to';
			const toLabel = this.translateService.instant(translateKeyTo);
			const [fromDurationVersion, toDurationVersion] = durationVersions;
			const durationFrom = this.humanizeDurationHelper.fromSeconds(fromDurationVersion.durationInSeconds);
			const durationTo = this.humanizeDurationHelper.fromSeconds(toDurationVersion.durationInSeconds);
			return `
				<div class="flex gap-1"><div class="text-beeColor-500">${fromLabel}:</div> <div class="">${durationFrom}</div></div>
				<div class="flex gap-1"><div class="text-beeColor-500">${toLabel}:</div> <div class="">${durationTo}</div></div>
			`;
		}
		const result: string[] = [];
		durationVersions.forEach((durationVersion) => {
			const duration = this.humanizeDurationHelper.fromSeconds(durationVersion.durationInSeconds);
			if (duration) {
				result.push(duration);
			}
		});
		return result.join(' / ');
	}

	public getPriceValue(item: IServiceDto): string {
		const {durationVersions} = item;
		if (this.durationHelper.durationIsRangeMode(item) && durationVersions.length > 1) {
			const translateKeyFrom = 'keyword.capitalize.from';
			const fromLabel = this.translateService.instant(translateKeyFrom);
			const translateKeyTo = 'keyword.capitalize.to';
			const toLabel = this.translateService.instant(translateKeyTo);
			const [fromDurationVersion, toDurationVersion] = durationVersions;
			let priceForm = this.currencyPipe.transform(fromDurationVersion.prices[0].price, fromDurationVersion.prices[0].currency, 'symbol-narrow');
			if (!priceForm) {
				priceForm = '-';
			}
			let priceTo = this.currencyPipe.transform(toDurationVersion.prices[0].price, toDurationVersion.prices[0].currency, 'symbol-narrow');
			if (!priceTo) {
				priceTo = '-';
			}
			return `
					<div class="flex gap-1"><div class="text-beeColor-500">${fromLabel}:</div> <div class="">${priceForm}</div></div>
					<div class="flex gap-1"><div class="text-beeColor-500">${toLabel}:</div> <div class="">${priceTo}</div></div>
				`;
		}
		const result: string[] = [];
		item.durationVersions.forEach((durationVersion) => {
			const price = this.currencyPipe.transform(durationVersion.prices[0].price, durationVersion.prices[0].currency, 'symbol-narrow');
			if (price) {
				result.push(price);
			}
		});
		if (result.length === 0) {
			return '-';
		}
		return result.join(' / ');
	}

	/**
	 * V2
	 */

	public getDurationValueV2(item: IServiceDto): string {
		const {durationVersions} = item;
		const {0: fromDurationVersion} = durationVersions;
		const durationFrom = this.humanizeDurationHelper.fromSeconds(
			fromDurationVersion.durationInSeconds,
		);
		if (
			this.durationHelper.durationIsRangeMode(item) &&
			durationVersions.length > 1
		) {
			return `⌛ ${durationFrom}+`;
		}
		return `⌛ ${durationFrom}`;
	}

	public getTotalDurationValueV2(items: IServiceDto[]): string {
		let totalDurationInSeconds = 0;
		items.forEach((item) => {
			const {durationVersions} = item;
			let {0: fromDurationVersion} = durationVersions;
			if (
				this.durationHelper.durationIsRangeMode(item) &&
				durationVersions.length > 1
			) {
				fromDurationVersion = durationVersions[durationVersions.length - 1];
			}
			totalDurationInSeconds += fromDurationVersion.durationInSeconds;
		});
		const durationFrom = this.humanizeDurationHelper.fromSeconds(
			totalDurationInSeconds,
		);
		return `${durationFrom}`;
	}

	public getPriceValueV2(item: IServiceDto): string {
		const {durationVersions} = item;
		const {0: fromDurationVersion} = durationVersions;
		const priceForm = this.currencyPipe.transform(
			fromDurationVersion.prices[0].price,
			fromDurationVersion.prices[0].currency,
			'symbol-narrow',
			'1.0-2',
		);
		if (!priceForm) {
			return '-';
		}
		if (
			this.durationHelper.durationIsRangeMode(item) &&
			durationVersions.length > 1
		) {
			return `💰 ${priceForm}+`;
		}
		return `💰 ${priceForm}`;
	}

	public getTotalPriceValueV2(items: IServiceDto[]): string {
		const baseCurrency = this.baseCurrency.value ?? CurrencyCodeEnum.USD;

		if (!items?.length) {
			const priceForm = this.currencyPipe.transform(
				0,
				baseCurrency,
				'symbol-narrow',
				'1.0-2',
			);
			return `${priceForm}`;
		}

		const perCurrencyTotalPrice = new Map<CurrencyCodeEnum, number>();
		items.forEach((item) => {
			const {durationVersions} = item;
			let {0: fromDurationVersion} = durationVersions;
			if (
				this.durationHelper.durationIsRangeMode(item) &&
				durationVersions.length > 1
			) {
				fromDurationVersion = durationVersions[durationVersions.length - 1];
			}
			const {price, currency} = fromDurationVersion.prices[0];
			perCurrencyTotalPrice.set(currency, (perCurrencyTotalPrice.get(currency) ?? 0) + price);
		});

		const result: string[] = [];

		perCurrencyTotalPrice.forEach((totalPrice, currency) => {

			if (!totalPrice) {
				return;
			}

			const priceForm = this.currencyPipe.transform(
				totalPrice,
				currency,
				'symbol-narrow',
				'1.0-2',
			);
			if (priceForm) {
				result.push(priceForm);
			}
		});

		return result.join(' + ');
	}

}
