import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import EOrderService, {OrderServiceColorStatusMap} from "@tenant/order/order-service/domain/entity/e.order-service";
import {
	OrderServicePresentationActions
} from "@tenant/order/order-service/infrastructure/state/presentation/order-service.presentation.actions";
import {CurrencyPipe, NgTemplateOutlet} from "@angular/common";
import {LanguageRecord} from "@core/shared/enum";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";

@Component({
	standalone: true,
	selector: 'lightweight-order-service-card-molecule',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		TranslatePipe,
		NgTemplateOutlet,
		DynamicDatePipe,
	],
	providers: [DurationVersionHtmlHelper, CurrencyPipe],
	template: `
		<bee-card padding="p-0" class="text-sm hover:ring-2 cursor-pointer" (click)="singleClick()">
			<div class="flex flex-col">
				@let statusColor = orderServiceColorStatusMap[item().status];
				<div class="p-2 px-3 flex flex-col flex-wrap justify-start items-start rounded-t-2xl {{ statusColor.bg }} {{ statusColor.text }}">

					<div class="flex w-full items-center justify-between cursor-pointer">
						<div class="flex items-center gap-1">
							<div class=" text-lg font-bold">{{ item().orderAppointmentDetails.start | dynamicDate: 'shortWithOutSeconds' }}</div>
						</div>
						{{ ('event.keyword.status.singular.' + item().status) | translate }}
					</div>

					<div class="flex items-center gap-2">
						<div class="" [innerHTML]="durationVersionHtmlHelper.getDurationValue(item().serviceSnapshot)"></div>· <div class="" [innerHTML]="durationVersionHtmlHelper.getPriceValue(item().serviceSnapshot)"></div>
					</div>

				</div>
				<div class="flex flex-col">

					<div class="w-full bg-[#FFFFFF] rounded-b-2xl">
						<div class="flex justify-between p-2 items-center gap-2 border-b-stone-100 border-b">
							<ng-container *ngTemplateOutlet="customerFragment"/>
							<div class="text-2xl">
								<i class="bi bi-arrow-right"></i>
							</div>
							<ng-container *ngTemplateOutlet="specialistFragment"/>
						</div>
						<div class="flex justify-between border-b-stone-100 border-b rounded-b-2xl">
							<div
								class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A] break-all">
								{{ item().serviceSnapshot.languageVersions[0].title }}
							</div>
						</div>

					</div>
				</div>
			</div>
		</bee-card>

		<ng-template #customerFragment>
			<div class="flex gap-1 items-center justify-center rounded-2xl bg-neutral-100 p-2">
				@let customer = item().orderAppointmentDetails.attendees[0].customer;
				@if (customer.customerType === customerTypeEnum.anonymous) {

					<div
						class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 max-h-9 max-w-9 flex justify-center items-center font-bold text-neutral-700">
						<i class="bi bi-person"></i>
					</div>

				} @else {

					@let firstName = customer.firstName ?? '' ;
					@let lastName = customer.lastName ?? '' ;

					<div
						class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-9 min-w-9 max-h-9 max-w-9 flex justify-center items-center font-bold text-yellow-700">
						{{ firstName?.[0] ?? '' }}{{ lastName?.[0] ?? '' }}
					</div>

				}

				<div>
					<div class="text-xs text-neutral-500 px-1">
						{{ 'keyword.capitalize.customer' | translate }} ·
						@for(languageCode of item().orderAppointmentDetails.languageCodes; track languageCode) {
							{{ 	languageRecord[languageCode] }}
						}
					</div>
					<div class="font-bold">
						@switch (customer.customerType) {

							@case (customerTypeEnum.unregistered) {
								{{ customer.firstName }} {{ customer.lastName }}
							}
							@case (customerTypeEnum.regular) {
								{{ customer.firstName }} {{ customer.lastName }}
							}
							@case (customerTypeEnum.anonymous) {
								{{ 'keyword.capitalize.anonymous' | translate }}
							}
						}
					</div>
				</div>
			</div>
		</ng-template>

		<ng-template #specialistFragment>
			@let specialist = item().orderAppointmentDetails.specialists[0].member;
			<div class="flex items-center gap-2 rounded-2xl bg-neutral-100 text-sm font-medium py-2.5 px-3 text-[#11141A]">
				@if (specialist.avatar) {
					<img class=" min-h-9 min-w-9 max-h-9 max-w-9 rounded-full object-cover"
						 [src]="specialist.avatar.url"
						 alt="Avatar">
				} @else {
					<div
						class=" min-h-9 min-w-9 max-h-9 max-w-9 flex items-center justify-center bg-[#1F2937] text-[#FFFFFF] rounded-full text-xs font-semibold">
						{{ specialist?.firstName?.charAt(0) }}
					</div>
				}
				{{ specialist.firstName }}
			</div>
		</ng-template>
	`
})
export class LightweightOrderServiceCardMolecule {

	public readonly item = input.required<EOrderService>();
	public readonly customerTypeEnum = CustomerTypeEnum;

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	private readonly store = inject(Store);

	public readonly languageRecord = LanguageRecord;
	public readonly orderServiceColorStatusMap = OrderServiceColorStatusMap;

	public singleClick() {

		const item = this.item();
		const action = new OrderServicePresentationActions.OpenDetails(item);
		this.store.dispatch(action);

	}

}
