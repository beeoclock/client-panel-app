import {Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {IService} from "@service/domain";
import {CurrencyPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";

@Component({
	selector: 'service-item-component',
	template: `
		<div class="flex gap-3 mr-3">
			<div class="">
				<img
					*ngIf="item?.presentation?.banners?.[0] as banner"
					bocMedia
					[src]="banner"
					twHeight="h-[90px]"
					twWidth="w-[90px]"
					class="hidden w-[90px] h-[90px] rounded-2xl object-cover"
					alt="Image of service">
			</div>
			<div class="flex flex-col flex-1 text-center md:text-start">
				<div class="w-full text-lg font-semibold">{{ item.languageVersions[0].title }}</div>
				<div class="w-full hidden lg:block">{{ item.languageVersions[0].description }}</div>
			</div>
		</div>
		<div class="flex flex-col items-end">

			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getPriceValue(item)"></span>
			<span class="truncate" [innerHTML]="durationVersionHtmlHelper.getDurationValue(item)"></span>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CurrencyPipe,
		HumanizeDurationPipe,
		NgIf,
		NgForOf,
		NgOptimizedImage,
		BocMediaDirective
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	]
})
export class ServiceItemComponent {

	@Input()
	public item!: IService;

	@HostBinding()
	public class = ['inline-flex', 'items-center', 'justify-between', 'flex-col', 'md:flex-row', 'w-full', 'p-5', 'text-gray-500', 'rounded-2xl', 'dark:text-gray-400'];

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

}
