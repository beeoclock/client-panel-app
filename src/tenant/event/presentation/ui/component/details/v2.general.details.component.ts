import {Component, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {IAttendee, IEvent_V2} from "@tenant/event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass} from "@angular/common";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {ISpecialist} from "@tenant/service/domain/interface/i.specialist";
import {ICustomer} from "@tenant/customer/domain";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'event-v2-general-details',
	standalone: true,
	imports: [
		TranslateModule,
		NgClass,
		PrimaryLinkStyleDirective,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	host: {
		class: 'block bg-white'
	},
	template: `
		<div class="border-t border-gray-100">
			<dl class="divide-y divide-gray-100">
				<div class="p-2">
					<dt class="text-sm font-medium leading-6 text-gray-900">
						{{ 'keyword.capitalize.customer' | translate }}
					</dt>
					<dd class="mt-2 text-sm text-gray-900">
						<ul role="list" class="flex flex-col gap-2">
							@for (customer of attendantMap.customers; track customer._id) {
								@if (customer) {
									<li
										class="flex flex-col gap-2 p-4 text-sm leading-6 rounded-2xl bg-neutral-100 border">
										@switch (customer.customerType) {
											@case (customerTypeEnum.unregistered) {
												<div class="font-bold text-lg">
													{{ customer.firstName }} {{ customer.lastName }}
												</div>
											}
											@case (customerTypeEnum.regular) {
												<div class="flex flex-wrap gap-2">
													<button (click)="openCustomerDetails(customer)"
															class="font-bold inline-flex px-3 py-2 hover:bg-neutral-200 rounded-2xl gap-2 items-center">
														{{ customer.firstName }} {{ customer.lastName }}
														<i class="bi bi-eye"></i>
													</button>
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
					<div class="mt-1 text-sm leading-6 rounded-2xl p-4 bg-neutral-100 border">
						<div class="text-sm font-medium leading-6 text-gray-900">
							{{ 'keyword.capitalize.customerNote' | translate }}
						</div>
						<span [ngClass]="{
							'text-beeColor-500 italic': !thereIsDescription,
							'text-gray-700': thereIsDescription
						}">
							{{ thereIsDescription ? event().note : ('keyword.capitalize.noData' | translate) }}
						</span>
					</div>
				</div>
				<div class="p-2">
					<div class="mt-1 text-sm leading-6 rounded-2xl p-4 bg-neutral-100 border flex flex-col gap-2">
						<div class="text-sm font-medium leading-6 text-gray-900 flex flex-col">
							<span>{{ 'keyword.capitalize.businessNote' | translate }}</span>
							<span class="text-xs">({{ 'keyword.capitalize.clientDoesNotSeeThisData' | translate }})</span>
						</div>
						<span [ngClass]="{
							'text-beeColor-500 italic': !thereIsBusinessNote,
							'text-gray-700': thereIsBusinessNote
						}">
							{{ thereIsBusinessNote ? event().originalData.order.businessNote : ('keyword.capitalize.noData' | translate) }}
						</span>
					</div>
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
		return new CustomerPresentationActions.OpenDetails(customer);
	}

}
