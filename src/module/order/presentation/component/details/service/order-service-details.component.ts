import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {
	AttendeeCardComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/attendee-card/attendee.card.component";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";

@Component({
	standalone: true,
	selector: 'app-order-service-details',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AttendeeCardComponent,
		CurrencyPipe,
		DatePipe,
		HumanizeDurationPipe,
		NgIf,
		NoDataPipe,
		TranslateModule
	],
	template: `

		<div class="flex justify-between items-center gap-8">

			<div class="flex items-center gap-2 w-full">
				<div
					class="bg-neutral-100 text-neutral-800 font-medium inline-flex gap-1 items-center px-2 py-0.5 rounded-2xl dark:bg-gray-700 dark:text-neutral-400 border border-neutral-400">
					{{ (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0) | currency: (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.currency ?? 'USD') : 'symbol-narrow'  }}
				</div>
				<div
					class="bg-neutral-100 text-neutral-800 font-medium inline-flex gap-1 items-center px-2 py-0.5 rounded-2xl dark:bg-gray-700 dark:text-neutral-400 border border-neutral-400">
					<i class="bi bi-clock text-beeColor-500"></i>
					{{ (service.serviceSnapshot?.durationVersions?.[0]?.durationInSeconds ?? 0) | humanizeDuration }}
				</div>
			</div>

		</div>
		<div class="cursor-pointer inline-flex gap-4 items-center">
			<i class="bi bi-calendar text-beeColor-500"></i>
			<div class="inline-flex gap-2">
				{{ service.orderAppointmentDetails?.start | date: 'yyyy-MM-dd HH:mm' }}
			</div>
		</div>
		<div class="cursor-pointer inline-flex gap-4 items-center">
			<i class="bi bi-cart text-beeColor-500"></i>
			{{ service.serviceSnapshot?.languageVersions?.[0]?.title | noData }}
		</div>
		<div class="cursor-pointer inline-flex gap-4 items-center">
			<i class="bi bi-file-person text-beeColor-500"></i>
			{{ service.orderAppointmentDetails?.specialists?.[0]?.member?.firstName }}
			{{ service.orderAppointmentDetails?.specialists?.[0]?.member?.lastName }}
		</div>
		@for (attendee of (service.orderAppointmentDetails?.attendees ?? []); track attendee._id) {
			<event-attendee-card-component
				[attendee]="attendee"/>
		}
		@if (service?.customerNote?.length) {

			<hr class="mt-2">
			<div class="text-neutral-500 dark:text-neutral-400 py-2">
				{{ service.customerNote }}
			</div>
		}

		<ng-content select="[slot='footer']"/>

	`
})
export class OrderServiceDetailsComponent {

	@Input({required: true})
	public service!: IOrderServiceDto;

	@HostBinding()
	public class = 'bg-white shadow rounded-2xl flex flex-col p-4 text-sm w-full border gap-2';

}
