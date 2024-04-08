import {Component, HostBinding, inject, Input} from "@angular/core";
import {RMIEvent} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";

@Component({
	selector: 'event-general-details',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		CurrencyPipe,
		NgForOf,
		NgIf,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		NgClass,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	template: `

		<div class="p-4 flex justify-between">
			<h3 class="text-base font-semibold leading-7 text-gray-900">
				{{ 'keyword.capitalize.details' | translate }}
			</h3>
			<div *ngIf="isNotPreview" eventStatusStyle [status]="event.status"></div>
			<div
				*ngIf="isPreview"
				class="px-2 py-1 flex items-center justify-center h-6 text-xs rounded-full border text-white uppercase bg-blue-500 border-blue-500 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
				{{ 'keyword.capitalize.preview' | translate }}
			</div>
		</div>
		<div class="border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.service' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
							<li class="flex">
								<img
									[src]="event.services[0].presentation?.banners?.[0]?.url ?? ''"
									class="object-cover bg-beeColor-200 rounded-l-md w-14 md:min-w-[128px] md:max-w-[128px] md:min-h-[128px] md:max-h-[128px]"
									alt=""/>
								<div class="flex flex-col justify-center text-sm leading-6 p-4">
									<strong>{{ event.services[0].languageVersions[0].title }}</strong>
									<div class="flex w-full gap-4">
										<div
											class="flex flex-col"
											[innerHTML]="durationVersionHtmlHelper.getDurationValue(event.services[0])">
										</div>
										<div
											class="flex flex-col"
											[innerHTML]="durationVersionHtmlHelper.getPriceValue(event.services[0])">
										</div>
									</div>
									<p class="text-beeColor-500 line-clamp-2">{{ event.services[0].languageVersions[0].description }}</p>
								</div>
							</li>
						</ul>
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.clients' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
							<ng-container *ngFor="let attendant of event.attendees; let index = index;">
								<li
									*ngIf="attendant.customer"
									class="grid grid-cols-1 py-4 pl-4 pr-5 text-sm leading-6">
									<div class="">
										{{ attendant.customer.firstName }} {{ attendant.customer.lastName }}
									</div>
									<div class="">
										{{ attendant.customer.email }}
									</div>
									<div class="">
										{{ attendant.customer.phone }}
									</div>
								</li>
							</ng-container>
						</ul>
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.specialist' | translate }}
					</dt>
					<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center gap-2">
						<div
							class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center font-bold text-white">
							{{ firstName[0] }}{{ lastName[0] }}
						</div>
						{{ firstName }} {{ lastName }}
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.dateAndTime' | translate }}
					</dt>
					<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
						{{ event.start | dynamicDate: 'medium' }}
					</dd>
				</div>
				<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.note' | translate }}
					</dt>
					<dd
						class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0"
						[ngClass]="{
							'text-beeColor-500 italic': !thereIsDescription,
							'text-gray-700': thereIsDescription
						}">
						{{ thereIsDescription ? event.description : ('keyword.capitalize.noData' | translate) }}
					</dd>
				</div>
			</dl>
		</div>

	`
})
export class GeneralDetailsComponent {

	@Input({required: true})
	public event!: RMIEvent;

	@Input()
	public isPreview = false;

	@HostBinding()
	public class = 'block bg-white';

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public get isNotPreview(): boolean {
		return !this.isPreview;
	}

	public get firstName(): string {
		return this.event?.services?.[0]?.specialists?.[0]?.member?.firstName ?? '';
	}

	public get lastName(): string {
		return this.event?.services?.[0]?.specialists?.[0]?.member?.lastName ?? '';
	}

	public get thereIsDescription(): boolean {
		return !!this.event?.description?.length;
	}

}
