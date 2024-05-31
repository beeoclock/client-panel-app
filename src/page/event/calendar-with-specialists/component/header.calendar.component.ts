import {Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import * as Member from "@member/domain";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-header-calendar-component',
	template: `
		<ng-container *ngIf="member">
			<div
				class="dark:text-slate-200 flex font-medium gap-1 h-full items-center justify-start px-1 text-slate-900 text-sm">
				<div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center">
					<ng-container *ngIf="member?.avatar?.url; else InitialsTemplate">
						<img [src]="member.avatar.url" class="min-h-8 min-w-8 max-h-8 max-w-8 h-8 w-8 rounded-full" alt="">
					</ng-container>
					<ng-template #InitialsTemplate>
						<div class="text-white text-xs font-bold">{{ getMemberFirstName[0] }}</div>
						<div class="text-white text-xs font-bold">{{ getMemberLastName[0] }}</div>
					</ng-template>
				</div>
				<div class="line-clamp-2">{{ getMemberFirstName }} {{ getMemberLastName }}</div>
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
	public get id(): string {
		return 'header-of-calendar-' + (this.member?._id ?? '');
	}

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
