import {Component, inject, input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {IAttendee, IEvent_V2} from "@tenant/event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass} from "@angular/common";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";
import {ISpecialist} from "@tenant/service/domain/interface/i.specialist";
import {ICustomer} from "@tenant/customer/domain";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {ReactiveFormsModule} from "@angular/forms";
import {BusinessNoteComponent} from "@tenant/event/presentation/ui/component/details/component/business-note.component";


@Component({
	selector: 'event-v2-general-details',
	standalone: true,
	imports: [
		TranslateModule,
		NgClass,
		ReactiveFormsModule,
		BusinessNoteComponent,
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

					@for (customer of attendantMap.customers; track customer._id) {

						@if (customer) {

							@switch (customer.customerType) {

								@case (customerTypeEnum.unregistered) {

									<div
										class="p-4 group bg-neutral-100 flex flex-col w-full bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
										<div class="flex justify-between items-center gap-x-3">

											<div
												class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-neutral-700">
												<i class="bi bi-person"></i>
											</div>

											<div class="grow">
												<h3 class="group-hover:text-blue-600 text-start font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">

													{{ customer.firstName }} {{ customer.lastName }}
												</h3>
												<p class="text-sm text-gray-500 dark:text-neutral-500 flex gap-2">
													{{ 'keyword.capitalize.customer' | translate }}
												</p>
											</div>

										</div>
									</div>

								}
								@case (customerTypeEnum.regular) {

									<button (click)="openCustomerDetails(customer)"
											class="p-4 group flex flex-col w-full bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
										<div class="flex justify-between items-center gap-x-3">

											@let firstName = customer.firstName ?? '' ;
											@let lastName = customer.lastName ?? '' ;

											<div
												class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-yellow-700">
												{{ firstName[0] }}{{ lastName[0] }}
											</div>

											<div class="grow">
												<h3 class="group-hover:text-blue-600 text-start font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
													{{ customer.firstName }} {{ customer.lastName }}
												</h3>
												<p class="text-sm text-gray-500 dark:text-neutral-500 flex gap-2">
													@if (customer.phone?.length) {
														{{ customer.phone }}
													} @else {
														@if (customer.email?.length) {
															{{ customer.email }}
														}
													}
												</p>
											</div>
											<div>
												<i class="bi bi-chevron-right"></i>
											</div>

										</div>
									</button>
								}
								@case (customerTypeEnum.anonymous) {

									<div
											class="p-4 group bg-neutral-100 flex flex-col w-full border border-gray-200 shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
										<div class="flex justify-between items-center gap-x-3">

											<div
												class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-neutral-700">
												<i class="bi bi-person"></i>
											</div>

											<div class="grow">
												<h3 class="group-hover:text-blue-600 text-start font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
													{{ 'keyword.capitalize.anonymous' | translate }}
												</h3>
												<p class="text-sm text-gray-500 dark:text-neutral-500 flex gap-2">
													{{ 'keyword.capitalize.customer' | translate }}
												</p>
											</div>

										</div>
									</div>
								}
							}

						}
					}
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
							<span class="text-xs">({{ 'keyword.capitalize.clientDoesNotSeeThisData' | translate }}
								)</span>
						</div>
						<app-business-note-component [order]="event().originalData.order"/>
					</div>
				</div>
			</dl>
		</div>

	`
})
export class V2GeneralDetailsComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
		order: IOrder.DTO;
		service: IOrderService.DTO;
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

			const {attendees} = event.currentValue as IEvent_V2<{ order: IOrder.DTO; service: IOrderService.DTO; }>;
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

	@Dispatch()
	public openCustomerDetails(customer: ICustomer.DTO) {
		return new CustomerPresentationActions.OpenDetails(customer);
	}

}
