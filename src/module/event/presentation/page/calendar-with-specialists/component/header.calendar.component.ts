import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-header-calendar-component',
	template: `
		<ng-container *ngIf="member">
			<div
				class="flex gap-2 items-center justify-start h-full px-2 text-slate-900 dark:text-slate-200 text-sm font-medium">
				<div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center">
					<div class="text-white text-xs font-bold">{{ member?.firstName?.[0] ?? '' }}</div>
					<div class="text-white text-xs font-bold">{{ member?.lastName?.[0] ?? ''}}</div>
				</div>
				<div>{{ member?.firstName ?? '' }} {{ member?.lastName ?? '' }}</div>
			</div>
		</ng-container>
	`,
	standalone: true,
	imports: [
		NgIf
	],
	encapsulation: ViewEncapsulation.None
})
export class HeaderCalendarComponent {

	@Input()
	public member: Member.RIMember | null = null;

	@Input()
	public columnIndex!: number;

	@HostBinding('style.grid-column-start')
	public get gridColumnStart() {
		return this.columnIndex + 1;
	}

	@HostBinding()
	public get class() {
		return 'row-start-[1] sticky top-0 z-20 bg-white dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-700 border-slate-100 dark:border-black/10 border-b';
	}

}
