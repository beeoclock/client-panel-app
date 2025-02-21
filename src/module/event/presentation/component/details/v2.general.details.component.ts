import {Component, HostBinding, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {IAttendee, IEvent_V2} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass} from "@angular/common";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {IOrderServiceDto} from "@src/core/business-logic/order/interface/i.order-service.dto";
import {ISpecialist} from "@src/core/business-logic/service/interface/i.specialist";
import {ICustomer} from "@src/core/business-logic/customer";
import {OrderServiceStatusEnum} from "@src/core/business-logic/order/enum/order-service.status.enum";
import {
	OrderServiceStatusStyleDirective
} from "@event/presentation/directive/order-service-status-style/order-service-status-style.directive";
import {CustomerTypeEnum} from "@src/core/business-logic/customer/enum/customer-type.enum";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";
import {CustomerActions} from "@customer/infrastructure/state/customer/customer.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'event-v2-general-details',
	standalone: true,
	imports: [
		TranslateModule,
		NgClass,
		OrderServiceStatusStyleDirective,
		PrimaryLinkButtonDirective,
		PrimaryLinkStyleDirective,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	template: `

		<div class="p-2 flex justify-between">
			@if (isPreview()) {
				<div
					class="px-2 py-1 flex items-center justify-center h-6 text-xs rounded-full border text-white uppercase bg-blue-500 border-blue-500 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
					{{ 'keyword.capitalize.preview' | translate }}
				</div>
			} @else {
				@if (status) {
					<div orderServiceStatusStyle [status]="status"></div>
				}
			}
		</div>
		<div class="border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="p-2">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.customer' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900">
						<ul role="list" class="divide-y divide-gray-100 rounded-lg border border-gray-200">
							@for (customer of attendantMap.customers; track customer._id) {
								@if (customer) {
									<li
										class="flex flex-col gap-2 py-4 px-3 text-sm leading-6">
										@switch (customer.customerType) {
											@case (customerTypeEnum.unregistered) {
												<div class="font-bold text-lg">
													{{ customer.firstName }} {{ customer.lastName }}
												</div>
											}
											@case (customerTypeEnum.regular) {
												<button primaryLink (click)="openCustomerDetails(customer)"
														class="font-bold text-lg px-4">
													{{ customer.firstName }} {{ customer.lastName }}
												</button>
												<div class="flex flex-wrap gap-2">
													@if (customer.email?.length) {
														<a href="mailto:{{ customer.email }}"
														   primaryLinkStyle class="gap-2">
															<i class="bi bi-envelope-at"></i>
															{{ customer.email }}
														</a>
													}
													@if (customer.phone?.length) {
														<a href="tel:{{ customer.phone }}"
														   primaryLinkStyle class="gap-2">
															<i class="bi bi-telephone"></i>
															{{ customer.phone }}
														</a>
													}
													@if (customer.phone?.length) {
														<a href="sms:{{ customer.phone }}"
														   primaryLinkStyle class="gap-2">
															<i class="bi bi-send"></i>
															SMS
														</a>
													}
												</div>
											}
											@case (customerTypeEnum.anonymous) {
												<div class="font-bold">
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
				<div class="p-2">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.customerNote' | translate }}
					</dt>
					<dd
						class="mt-1 text-sm leading-6"
						[ngClass]="{
							'text-beeColor-500 italic': !thereIsDescription,
							'text-gray-700': thereIsDescription
						}">
						{{ thereIsDescription ? event().note : ('keyword.capitalize.noData' | translate) }}
					</dd>
				</div>
				<div class="p-2">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.businessNote' | translate }}
					</dt>
					<dd
						class="mt-1 text-sm leading-6"
						[ngClass]="{
							'text-beeColor-500 italic': !thereIsBusinessNote,
							'text-gray-700': thereIsBusinessNote
						}">
						{{ thereIsBusinessNote ? event().originalData.order.businessNote : ('keyword.capitalize.noData' | translate) }}
					</dd>
				</div>
			</dl>
		</div>

	`
})
export class V2GeneralDetailsComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
		order: IOrder.DTO;
		service: IOrderServiceDto;
	}>>();

	public readonly isPreview = input(false);

	@HostBinding()
	public class = 'block bg-white';

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public readonly attendantMap: {
		specialists: ISpecialist[];
		customers: ICustomer.DTO[];
	} = {
		specialists: [],
		customers: [],
	};

	public bannerUrl: string = '';
	public title: string = '';
	public description: string = '';
	public status: OrderServiceStatusEnum | null = null;
	public readonly customerTypeEnum = CustomerTypeEnum;

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

		const {event} = changes;

		if (event) {

			this.attendantMap.specialists = [];
			this.attendantMap.customers = [];

			const {attendees} = event.currentValue as IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; }>;
			attendees.forEach((attendee) => {
				(attendee.is === 'specialist') && this.attendantMap.specialists.push(attendee.originalData as ISpecialist);
				(attendee.is === 'customer') && this.attendantMap.customers.push((attendee.originalData as IAttendee).customer);
			});

			this.bannerUrl = this.event()?.originalData?.service?.serviceSnapshot?.presentation?.banners?.[0]?.url ?? '';
			this.title = this.event()?.originalData?.service?.serviceSnapshot?.languageVersions?.[0]?.title ?? '';
			this.description = this.event()?.originalData?.service?.serviceSnapshot?.languageVersions?.[0]?.description ?? '';
			this.status = this.event()?.originalData?.service?.status ?? null;

		}

	}

	public get thereIsDescription(): boolean {
		return !!this.event()?.note?.length;
	}

	public get thereIsBusinessNote(): boolean {
		return !!this.event()?.originalData.order.businessNote?.length;
	}

	@Dispatch()
	public openCustomerDetails(customer: ICustomer.DTO) {
		return new CustomerActions.OpenDetailsById(customer._id);
	}

}
