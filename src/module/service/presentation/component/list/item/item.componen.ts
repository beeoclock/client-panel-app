import {Component, Input, ViewEncapsulation} from "@angular/core";
import {IService} from "@service/domain";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {CurrencyPipe} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
	selector: 'service-item-component',
	template: `
		<div
			class="inline-flex items-center justify-between flex-col md:flex-row w-full p-5 text-gray-500 rounded-2xl dark:text-gray-400">
			<div class="flex gap-3 mr-3">
				<div class="">
					<img
						bocMedia
						[src]="item?.presentation?.banners?.[0] ?? ''"
						twHeight="h-[90px]"
						twWidth="w-[90px]"
						class="hidden w-[90px] h-[90px] rounded-2xl object-cover"
						alt="Image of service">
				</div>
				<div class="flex flex-col flex-1 text-start">
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
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		BocMediaDirective,
		CurrencyPipe,
		HumanizeDurationPipe
	]
})
export class ServiceItemComponent {

	@Input()
	public item!: IService;

}