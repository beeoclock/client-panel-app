import {inject, Injectable} from "@angular/core";

import {DurationHelper} from "@utility/helper/duration.helper";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";
import {CurrencyPipe} from "@angular/common";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {BASE_CURRENCY} from "@src/token";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class DurationVersionHtmlHelper {

	private readonly durationHelper = inject(DurationHelper);
	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);
	private readonly currencyPipe = inject(CurrencyPipe);
	private readonly baseCurrency = inject(BASE_CURRENCY);

	public getDurationValue(item: IService.DTO): string {
		const {durationVersions} = item;
		if (this.durationHelper.durationIsRangeMode(item) && durationVersions.length > 1) {
			const [fromDurationVersion, toDurationVersion] = durationVersions;
			const durationFrom = this.humanizeDurationHelper.fromSeconds(fromDurationVersion.durationInSeconds);
			const durationTo = this.humanizeDurationHelper.fromSeconds(toDurationVersion.durationInSeconds);
			return `
				<div class="flex gap-1"><div class="text-neutral-500">${durationFrom} <span class="text-neutral-400">—</span> ${durationTo}</div></div>
			`;
		}
		const result: string[] = [];
		durationVersions.forEach((durationVersion) => {
			const duration = this.humanizeDurationHelper.fromSeconds(durationVersion.durationInSeconds);
			if (duration) {
				result.push(duration);
			}
		});
		return `<div class="text-neutral-500">${result.join(' / ')}</div>`;
	}

	public getPriceValue(item: IService.DTO): string {
		const {durationVersions} = item;
		if (this.durationHelper.durationIsRangeMode(item) && durationVersions.length > 1) {
			const [fromDurationVersion, toDurationVersion] = durationVersions;
			let priceForm = this.currencyPipe.transform(fromDurationVersion.prices[0].price, fromDurationVersion.prices[0].currency, 'symbol-narrow', '1.0-0');
			if (!priceForm) {
				priceForm = `<span class="text-neutral-400">∞</span>`;
			}
			let priceTo = this.currencyPipe.transform(toDurationVersion.prices[0].price, toDurationVersion.prices[0].currency, 'symbol-narrow', '1.0-0');
			if (!priceTo) {
				priceTo = `<span class="text-neutral-400">∞</span>`;
			}
			return `
					<div class="flex gap-1"><div class="">${priceForm} <span class="text-neutral-400">—</span> ${priceTo}</div></div>
				`;
		}
		const result: string[] = [];
		item.durationVersions.forEach((durationVersion) => {
			const price = this.currencyPipe.transform(durationVersion.prices[0].price, durationVersion.prices[0].currency, 'symbol-narrow', '1.0-0');
			if (price) {
				result.push(price);
			}
		});
		if (result.length === 0) {
			return `<span class="text-neutral-400">—</span>`;
		}
		return result.join(' / ');
	}

	/**
	 * V2
	 */

	public getTotalDurationValueV2(items: IService.DTO[]): string {
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

	public getTotalPriceValueV2(items: IService.DTO[]): string {
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
