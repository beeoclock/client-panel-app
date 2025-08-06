import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {IMember} from "src/tenant/member/member/domain";

@Component({
	selector: 'event-header-calendar-with-specialist-widget-component',
	template: `
		<div
			class="dark:text-slate-200 flex font-medium gap-1 h-full items-center justify-start px-1 text-slate-900 text-sm">
			<div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center">

				@if (member().avatar?.url) {

					<img [src]="member().avatar.url"
							class="min-h-8 min-w-8 max-h-8 max-w-8 h-8 w-8 rounded-full object-cover" alt="">

				} @else {

					<div class="text-white text-xs font-bold">{{ member().firstName[0] }}</div>
					<div class="text-white text-xs font-bold">{{ member().lastName[0] }}</div>

				}

			</div>
			<div class="line-clamp-2">{{ member().firstName }} {{ member().lastName }}</div>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HeaderCalendarWithSpecialistWidgetComponent {

	public readonly member = input.required<IMember.EntityRaw>();

}
