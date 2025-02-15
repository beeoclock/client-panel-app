import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@src/core/business-logic/member";

@Component({
	selector: 'event-header-calendar-with-specialist-widget-component',
	template: `
		@if (member) {
			<div
				class="dark:text-slate-200 flex font-medium gap-1 h-full items-center justify-start px-1 text-slate-900 text-sm">
				<div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center">

					@if (member.avatar?.url) {

						<img [src]="member.avatar.url"
							 class="min-h-8 min-w-8 max-h-8 max-w-8 h-8 w-8 rounded-full object-cover" alt="">

					} @else {

						<div class="text-white text-xs font-bold">{{ getMemberFirstName[0] }}</div>
						<div class="text-white text-xs font-bold">{{ getMemberLastName[0] }}</div>

					}

				</div>
				<div class="line-clamp-2">{{ getMemberFirstName }} {{ getMemberLastName }}</div>
			</div>
		}
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HeaderCalendarWithSpecialistWidgetComponent {

	@Input()
	public member: Member.RIMember | null = null;

	@HostBinding()
	public get class() {
		return 'row-start-[1] sticky top-0 z-20 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 border-b';
	}

	public get getMemberFirstName(): string {
		return this.member?.firstName ?? '';
	}

	public get getMemberLastName(): string {
		return this.member?.lastName ?? '';
	}

}
