import {Component, HostBinding, inject, input, ViewEncapsulation} from "@angular/core";

import {CurrencyPipe} from "@angular/common";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";

@Component({
	selector: 'service-item-component',
	template: `
		<div class="flex gap-3 mr-3">
			@for (banner of item().presentation?.banners ?? []; track banner._id) {
				<div>
					@if (banner) {

						<img
							[src]="banner"
							class="w-[90px] h-[90px] rounded-2xl object-cover"
							alt="Image of service">
					}
				</div>
			}
			<div class="flex flex-col flex-1 text-center md:text-start">
				<div class="w-full text-lg font-semibold">{{ item().languageVersions?.[0]?.title }}</div>
				<div class="w-full hidden lg:block">{{ item().languageVersions?.[0]?.description }}</div>
			</div>
		</div>
		<div class="flex flex-col items-end">

			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getPriceValue(item())"></span>
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getDurationValue(item())"></span>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	]
})
export class ServiceItemComponent {

	public readonly item = input.required<IServiceDto>();

	@HostBinding()
	public class = ['inline-flex', 'items-center', 'justify-between', 'flex-col', 'md:flex-row', 'w-full', 'p-5', 'text-gray-500', 'rounded-2xl', 'dark:text-gray-400'];

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

}
