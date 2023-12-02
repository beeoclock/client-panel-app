import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {IService} from "@service/domain";
import {CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
	selector: 'service-item-component',
	template: `
		<div class="flex gap-3 mr-3">
			<div
				*ngFor="let banner of item.presentation?.banners ?? []">
				<img
					*ngIf="banner"
					[src]="banner.url"
					class="w-[90px] h-[90px] rounded-2xl object-cover"
					alt="Image of service">
			</div>
			<div class="flex flex-col flex-1 text-center md:text-start">
				<div class="w-full text-lg font-semibold">{{ item.languageVersions[0].title }}</div>
				<div class="w-full hidden lg:block">{{ item.languageVersions[0].description }}</div>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<div class="text-end text-sm whitespace-nowrap">
				{{ item.durationVersions[0].prices[0].price | currency: item.durationVersions[0].prices[0].currency: 'symbol-narrow' }}
			</div>
			<div class="text-end text-sm whitespace-nowrap">
				{{ item.durationVersions[0].durationInSeconds | humanizeDuration }}
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CurrencyPipe,
		HumanizeDurationPipe,
		NgIf,
		NgForOf,
		NgOptimizedImage
	]
})
export class ServiceItemComponent {

	@Input()
	public item!: IService;

	@HostBinding()
	public class = ['inline-flex', 'items-center', 'justify-between', 'flex-col', 'md:flex-row', 'w-full', 'p-5', 'text-gray-500', 'rounded-2xl', 'dark:text-gray-400'];

}
