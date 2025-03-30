import {Component, HostBinding, inject, input} from "@angular/core";
import {RMIEvent} from "@tenant/event/domain";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {
	EventStatusStyleDirective
} from "@tenant/event/presentation/directive/event-status-style/event-status-style.directive";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";

@Component({
	selector: 'event-general-details',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		NgForOf,
		NgIf,
		EventStatusStyleDirective,
		NgClass,
		NgSwitch,
		NgSwitchCase,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	template: `

		<div class="p-4 flex justify-between">
			@if (isPreview()) {

				<div
					class="px-2 py-1 flex items-center justify-center h-6 text-xs rounded-full border text-white uppercase bg-blue-500 border-blue-500 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
					{{ 'keyword.capitalize.preview' | translate }}
				</div>
			} @else {

				<div eventStatusStyle [status]="event().status"></div>
			}
		</div>
		<div class="border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="px-4 py-6">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.service' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900 ">
						<ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
							<li class="flex">
								@if (event().services[0].presentation?.banners?.[0]?.url; as bannerUrl) {
									<img
										[src]="bannerUrl"
										class="object-cover bg-beeColor-200 rounded-l-md w-14"
										alt=""/>
								}
								<div class="flex flex-col justify-center text-sm leading-6 p-4">
									<strong>{{ event().services[0].languageVersions[0].title }}</strong>
									<div class="flex w-full gap-4">
										<div
											class="flex flex-col"
											[innerHTML]="durationVersionHtmlHelper.getDurationValue(event().services[0])">
										</div>
										<div
											class="flex flex-col"
											[innerHTML]="durationVersionHtmlHelper.getPriceValue(event().services[0])">
										</div>
									</div>
									<p class="text-beeColor-500 line-clamp-2">{{ event().services[0].languageVersions[0].description }}</p>
								</div>
							</li>
						</ul>
					</dd>
				</div>
				<div class="px-4 py-6">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.clients' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900">
						<ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
							@for (attendant of event().attendees; track attendant._id) {

								@if (attendant.customer) {

									<li
										class="grid grid-cols-1 py-4 pl-4 pr-5 text-sm leading-6">

										@switch (attendant.customer.customerType) {

											@case (customerTypeEnum.unregistered) {
												<div class="">
													{{ attendant.customer.firstName }} {{ attendant.customer.lastName }}
												</div>
											}
											@case (customerTypeEnum.regular) {
												<div class="">
													{{ attendant.customer.firstName }} {{ attendant.customer.lastName }}
												</div>
												<div class="">
													{{ attendant.customer.email }}
												</div>
												<div class="">
													{{ attendant.customer.phone }}
												</div>
											}
											@case (customerTypeEnum.anonymous) {
												<div class="">
													{{ 'keyword.capitalize.anonymous' | translate }}
												</div>
											}
										}

									</li>
								}
							}
						</ul>
					</dd>
				</div>
				<div class="px-4 py-6">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.specialist' | translate }}
					</dt>
					<dd class="mt-1 text-sm leading-6 text-gray-700 flex items-center gap-2">
						<div
							class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center font-bold text-white">
							{{ firstName[0] }}{{ lastName[0] }}
						</div>
						{{ firstName }} {{ lastName }}
					</dd>
				</div>
				<div class="px-4 py-6 ">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.dateAndTime' | translate }}
					</dt>
					<dd class="mt-1 text-sm leading-6 text-gray-700">
						{{ event().start | dynamicDate: 'medium' }}
					</dd>
				</div>
				<div class="px-4 py-6 ">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.note' | translate }}
					</dt>
					<dd
						class="mt-1 text-sm leading-6 text-wrap break-words"
						[ngClass]="{
							'text-beeColor-500 italic': !thereIsDescription,
							'text-gray-700': thereIsDescription
						}">
						{{ thereIsDescription ? event().note : ('keyword.capitalize.noData' | translate) }}
					</dd>
				</div>
			</dl>
		</div>

	`
})
export class GeneralDetailsComponent {

	public readonly event = input.required<RMIEvent>();

	public readonly isPreview = input(false);

	@HostBinding()
	public class = 'block bg-white';

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	public readonly customerTypeEnum = CustomerTypeEnum;

	public get isNotPreview(): boolean {
		return !this.isPreview();
	}

	public get firstName(): string {
		return this.event()?.specialists?.[0]?.member?.firstName ?? '';
	}

	public get lastName(): string {
		return this.event()?.specialists?.[0]?.member?.lastName ?? '';
	}

	public get thereIsDescription(): boolean {
		return !!this.event()?.note?.length;
	}

}
