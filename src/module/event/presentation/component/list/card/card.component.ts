import {Component, EventEmitter, inject, Input, Output, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
    ChangeStatusOnCancelledComponent
} from "@event/presentation/component/change-status/change-status-on-cancelled.component";
import {ChangeStatusOnDoneComponent} from "@event/presentation/component/change-status/change-status-on-done.component";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RMIEvent} from "@event/domain";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {Store} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";

@Component({
	selector: 'event-card-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActionComponent,
		CardComponent,
		ChangeStatusOnCancelledComponent,
		ChangeStatusOnDoneComponent,
		CurrencyPipe,
		DatePipe,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		NgForOf,
		NgIf,
		NoDataPipe,
	],
	template: `
		<bee-card class="text-sm" gap="gap-2">
			<div class="flex justify-between items-center gap-8">
				<div class="flex items-center gap-2 w-full" (click)="singleClick.emit(item)">
					<div eventStatusStyle mode="text" [status]="item.status"></div>
					<div
						class="bg-neutral-100 text-neutral-800 font-medium inline-flex gap-2 items-center px-2 py-0.5 rounded-2xl dark:bg-gray-700 dark:text-neutral-400 border border-neutral-400">
						{{ (item?.services?.[0]?.durationVersions?.[0]?.prices?.[0]?.price ?? 0) | currency: item?.services?.[0]?.durationVersions?.[0]?.prices?.[0]?.currency: 'symbol-narrow'  }}
					</div>
				</div>
				<utility-table-column-action placement="bottom-start" [offsetDistance]="10" [id]="item._id!" (open)="singleClick.emit(item)" (edit)="edit()" (delete)="delete()"/>
			</div>
			<div
				(click)="singleClick.emit(item)"
				class="inline-flex gap-4 items-center">
				<i class="bi bi-calendar-week"></i>
				<div class="flex gap-4">
					<div *ngIf="sameYear(item.start)" class="flex justify-between capitalize">
						{{ item.start | date: 'EEEE, dd MMMM' }}
					</div>
					<div *ngIf="!sameYear(item.start)" class="flex justify-between capitalize">
						{{ item.start | date: 'EEEE, dd MMMM, yyyy' }}
					</div>
				</div>
			</div>
			<div
				(click)="singleClick.emit(item)"
				class="inline-flex gap-4 items-center">
				<i class="bi bi-clock"></i>
				<div class="inline-flex gap-2">
					{{ item.start | date: 'HH:mm' }} - {{ item.end | date: 'HH:mm' }}
					<div class="text-neutral-500">
						({{ item?.services?.[0]?.durationVersions?.[0]?.durationInSeconds ?? 0 | humanizeDuration }})
					</div>
				</div>
			</div>
			<div
				(click)="singleClick.emit(item)"
				class="inline-flex gap-4 items-center">
				<i class="bi bi-cart"></i>
				{{ item?.services?.[0]?.languageVersions?.[0]?.title | noData }}
			</div>
			<div
				(click)="singleClick.emit(item)"
				*ngFor="let attendant of (item?.attendees ?? [])"
				#attendantRef
				[attr.data-value]="(attendant?.customer?.firstName ?? '') + ' ' + (attendant?.customer?.lastName ?? '')"
				class="inline-flex gap-4 items-center">
				<i class="bi bi-person"></i>
				{{ (attendantRef?.getAttribute?.('data-value')?.length ?? 0) > 1 ? attendantRef.getAttribute('data-value') : (attendant?.customer?.email ?? attendant?.customer?.phone ?? '-') }}
			</div>
			<ng-container (click)="singleClick.emit(item)" *ngIf="item?.note?.length">
				<hr class="mt-2">
				<div class="text-neutral-500 dark:text-neutral-400 py-2">
					{{ item.note }}
				</div>
			</ng-container>
			<div class="flex gap-4 justify-between" *ngIf="item.isBooked">
				<event-change-status-on-cancelled-component [event]="item"/>
				<event-change-status-on-done-component [event]="item"/>
			</div>
		</bee-card>
	`
})
export class EventCardComponent {

	@Input({required: true})
	public item!: RMIEvent;

	@Output()
	public readonly singleClick = new EventEmitter<RMIEvent>();

	public sameYear(start: string | undefined): boolean {
		return start ? new Date(start).getFullYear() === new Date().getFullYear() : false;
	}

	private readonly store = inject(Store);

	public edit() {
		this.store.dispatch(new EventActions.OpenFormToEditById(this.item._id!));
	}

	public delete() {
		this.store.dispatch(new EventActions.DeleteItem(this.item._id!));
	}
}
