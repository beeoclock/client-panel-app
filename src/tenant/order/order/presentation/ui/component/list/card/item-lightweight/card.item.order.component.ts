import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	HostBinding,
	inject,
	input,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {CurrencyPipe} from "@angular/common";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {
	RowActionButtonComponent
} from "@tenant/order/order/presentation/ui/component/row-action-button/row-action-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {debounce} from "typescript-debounce-decorator";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {
	StatusOrderChipComponent
} from "@shared/presentation/component/smart/order/form/chip/status.order.chip.component";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";
import {
	CardItemOrderService
} from "@tenant/order/order/presentation/ui/component/list/card/item-lightweight/card.item.order.service";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {
	OrderServiceStatusIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/order-service-status-icon.component";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";

@Component({
	selector: 'app-card-item-lightweight-order-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CardComponent,
		NoDataPipe,
		RowActionButtonComponent,
		TranslateModule,
		CurrencyPipe,
		StatusOrderChipComponent,
		DynamicDatePipe,
		OrderServiceStatusIconComponent,
	],
	providers: [
		DurationVersionHtmlHelper,
		CurrencyPipe
	],
	template: `
		@if (order(); as order) {

			<bee-card padding="p-0" class="text-sm hover:ring-2"
					  [class.!border-green-500]="selectedIds().includes(order._id)">
				<div class="flex flex-col">
					<div class="p-2 flex flex-wrap justify-between items-center">

						<div class="flex flex-1 justify-between cursor-pointer">
							<app-status-order-chip-component
								(statusChanges)="statusChanges($event)"
								[initialValue]="order.status"
								[showLabel]="true"/>
						</div>

						<div class="flex items-center gap-2">
							@if (baseCurrency) {
								<div
									class="py-1 px-1.5 inline-flex items-center gap-x-1 bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">
									💰{{ totalAmount | currency: baseCurrency : 'symbol-narrow' }}
								</div>
							}
							@if (showAction()) {

								<app-order-row-action-button-component
									[item]="order"
									[id]="order._id"/>
							}
						</div>

						@if (showSelectedStatus()) {
							<div (click)="singleClick()" class=" cursor-pointer">
								@if (selectedIds().includes(order._id)) {
									<div
										class="w-full border border-green-200 bg-green-50 text-green-600 px-2 py-1 rounded-2xl">
										{{ 'keyword.capitalize.selected' | translate }}
									</div>
								} @else {
									<div
										class="w-full border border-blue-200 bg-blue-50 text-blue-600 px-2 py-1 rounded-2xl">
										{{ 'keyword.capitalize.select' | translate }}
									</div>
								}
							</div>
						}
					</div>
					<div class="flex flex-col cursor-pointer" (click)="singleClick()">

						@for (byCustomer of groups(); track byCustomer.customer._id) {

							@let customer = byCustomer.customer ;

							<div class="w-full bg-[#FFFFFF] rounded-t-[20px]">
								<div class="flex justify-between border-b-stone-100 border-b">
									<div
										class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">


										@if (customer.customerType === customerTypeEnum.anonymous) {

											<div
												class="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-neutral-700">
												<i class="bi bi-person"></i>
											</div>

										} @else {

											@let firstName = customer.firstName ?? '' ;
											@let lastName = customer.lastName ?? '' ;

											<div
												class="rounded-full uppercase bg-gradient-to-r from-amber-100 to-amber-200 min-h-9 min-w-9 flex justify-center items-center font-bold text-yellow-700">
												{{ firstName[0] }}{{ lastName[0] }}
											</div>

										}

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
									<!--									<div-->
									<!--										class="inline-flex items-center gap-2 rounded-md bg-[#F8FAFC] text-sm font-medium py-2.5 px-3 text-[#11141A]">-->
									<!--										@if (specialist.avatar) {-->
									<!--											<img class="w-[26px] h-[26px] rounded-full object-cover"-->
									<!--												 [src]="specialist.avatar"-->
									<!--												 alt="Avatar">-->
									<!--										} @else {-->
									<!--											<div-->
									<!--												class="w-[26px] h-[26px] flex items-center justify-center bg-[#1F2937] text-[#FFFFFF] rounded-full text-xs font-semibold">-->
									<!--												{{ specialist?.firstName?.charAt(0) }}-->
									<!--											</div>-->
									<!--										}-->
									<!--										{{ specialist.firstName }}-->
									<!--									</div>-->
								</div>

								@for (bySpecialistAndDate of byCustomer.services; track bySpecialistAndDate.date) {

									@let date = bySpecialistAndDate.date ;
									@let specialist = bySpecialistAndDate.specialist ;

									<div class="w-full bg-[#FFFFFF] rounded-t-[20px]">
										<div class="flex justify-between bg-[#F8FAFC] border-b-stone-100 border-b">
											<div
												class="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-3 text-[#11141A]">
												{{ bySpecialistAndDate.date | dynamicDate }}
											</div>
											<div
												class="inline-flex items-center gap-2 rounded-md bg-[#F8FAFC] text-sm font-medium py-2.5 px-3 text-[#11141A]">
												@if (specialist.avatar) {
													<img class="w-[26px] h-[26px] rounded-full object-cover"
														 [src]="specialist.avatar"
														 alt="Avatar">
												} @else {
													<div
														class="w-[26px] h-[26px] flex items-center justify-center bg-[#1F2937] text-[#FFFFFF] rounded-full text-xs font-semibold">
														{{ specialist?.firstName?.charAt(0) }}
													</div>
												}
												{{ specialist.firstName }}
											</div>
										</div>
										@for (service of bySpecialistAndDate.services; track service._id) {
											<div class="flex gap-2 px-3 py-2.5 border-b-stone-100 border-b">

												<div
													class="inline-flex shrink grow basis-0 items-center gap-1 self-stretch justify-between">
													<div
														class="flex items-center gap-2 text-sm line-clamp-2 font-regular leading-tight text-[#11141A]">
														<app-order-service-status-icon-component
															class="flex text-base"
															[status]="service.status"/>
														@if (service.serviceSnapshot?.presentation?.banners?.[0]?.url?.length) {
															<div>
																<img
																	class="h-14 w-14 min-h-14 min-w-14 rounded-lg shadow"
																	[src]="service.serviceSnapshot.presentation.banners[0].url"
																	alt="Service image"
																/>
															</div>
														}
														<span class="line-clamp-3">
															{{ service.serviceSnapshot.languageVersions[0].title }}
														</span>
													</div>
													<div class="flex gap-4">
														<div
															[innerHTML]="durationVersionHtmlHelper.getDurationValue(service.serviceSnapshot)"
															class="inline-flex items-center text-sm font-regular text-[#000000]"
														></div>
														<div
															[innerHTML]="durationVersionHtmlHelper.getPriceValue(service.serviceSnapshot)"
															class="inline-flex items-center text-sm font-regular text-[#000000]"
														></div>
													</div>
												</div>
											</div>
										}
									</div>
								}

							</div>
						}
						@if (order.products?.length) {
							@let orderedProducts = order.products ;
							<div class="flex flex-col justify-between">
								<div class="fond-bold pt-2 px-3 text-neutral-400">
									{{ 'keyword.capitalize.products' | translate }}:
								</div>
								@for (orderedProduct of orderedProducts; track orderedProduct._id) {
									<div class="flex gap-2 px-3 py-2.5 border-b-stone-100 border-b">

										<div
											class="inline-flex shrink grow basis-0 items-center gap-1 self-stretch justify-between">
											<div
												class="flex items-center gap-2 text-sm line-clamp-2 font-regular leading-tight text-[#11141A]">
												@let firstImage = orderedProduct.productSnapshot?.images?.[0]?.url ;
												@if (firstImage?.length) {
													<div>
														<img
															class="h-14 w-14 min-h-14 min-w-14 rounded-lg shadow"
															[src]="firstImage"
															alt="Service image"
														/>
													</div>
												}
												<span class="line-clamp-3">
												{{ orderedProduct.productSnapshot.languageVersions[0].title }}
											</span>
											</div>
											<div class="flex flex-col">
												<div
													class="inline-flex items-center self-end text-sm font-regular text-black">
													{{ orderedProduct.quantity * (orderedProduct.productSnapshot?.price?.value ?? 0) | currency: orderedProduct.productSnapshot?.price?.currency : 'symbol-narrow' }}
												</div>
												<div
													class="inline-flex items-center text-sm font-regular text-neutral-500 text-nowrap">
													{{ orderedProduct.quantity }} x
													{{ orderedProduct.productSnapshot?.price?.value | currency: orderedProduct.productSnapshot?.price?.currency : 'symbol-narrow' }}
												</div>
											</div>
										</div>
									</div>
								}

							</div>
						}
						<div class="flex justify-between p-2">

							@if (order.businessNote?.length) {
								<div class="flex-1">
									<div class="text-neutral-500">
										{{ 'keyword.capitalize.businessNote' | translate }}
									</div>
									<div>
										{{ order.businessNote | noData }}
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</bee-card>
		}
	`
})
export class CardItemLightweightOrderComponent {

	public readonly selectedIds = input<string[]>([]);

	public readonly orderDto = input.required<IOrder.DTO>();

	readonly showAction = input<boolean>(true);

	readonly showSelectedStatus = input<boolean>(false);

	private readonly cardItemOrderService = inject(CardItemOrderService);
	public readonly groups = computed(() => {
		const {services} = this.orderDto();
		const result = this.cardItemOrderService.groupByCustomerAndThenBySpecialistAndDate(services);
		return result;
	});

	public readonly order = signal<IOrder.DTO>({} as IOrder.DTO);

	@HostBinding()
	public id!: string;

	@HostBinding()
	public class = 'min-w-[340px] w-[340px]';

	public baseCurrency!: CurrencyCodeEnum;

	public totalAmount: number = 0;

	@debounce(300)
	public singleClick() {
		this.open();
	}

	@Dispatch()
	public open() {
		return new OrderActions.OpenDetails(this.orderDto());
	}

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public constructor() {
		afterNextRender({
			read: () => {
				this.order.set(this.orderDto());
			}
		});
		effect(() => {
			const orderDto = this.orderDto();
			this.id = orderDto._id;
			this.totalAmount = this.amount(orderDto);
			if (orderDto.services.length) {
				this.baseCurrency = orderDto.services[0].serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.currency ?? CurrencyCodeEnum.USD;
			} else {
				this.baseCurrency = orderDto.products[0]?.productSnapshot?.price?.currency ?? CurrencyCodeEnum.USD;
			}
		});
	}

	public statusChanges(status: OrderStatusEnum) {
		const orderDto = this.orderDto();
		if (status === orderDto.status) {
			return;
		}
		this.order.update((order) => {
			return {
				...order,
				status,
			};
		});
		this.dispatchStatus(status);
	}

	@Dispatch()
	public dispatchStatus(status: OrderStatusEnum) {
		return new OrderActions.ChangeStatus({
			item: this.order(),
			status
		});
	}

	public amount({services, products}: IOrder.DTO): number {

		const totalServiceAmount = services.reduce((acc, service) => {
			return acc + (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0);
		}, 0);

		const totalProductAmount = products.reduce((acc, service) => {
			return acc + (service.productSnapshot?.price?.value ?? 0) * (service.quantity ?? 1);
		}, 0);
		return totalProductAmount + totalServiceAmount;

	}

	protected readonly orderServiceStatusEnum = OrderServiceStatusEnum;
	protected readonly customerTypeEnum = CustomerTypeEnum;
}
