import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation} from "@angular/core";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {TypeTariffPlanEnum} from "@core/shared/enum/type.tariff-plan.enum";
import {CurrencyCodePipe} from "@utility/presentation/pipes/currency-code.pipe";
import {DecimalPipe, NgClass} from "@angular/common";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {BillingCycleEnum} from "@core/shared/enum/billing-cycle.enum";
import {TranslatePipe} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'main-tariff-plan-component',
	imports: [
		CurrencyCodePipe,
		NgClass,
		DecimalPipe,
		TranslatePipe
	],
	template: `
		<section id="tariffs"
				 class="flex w-full justify-center items-center">
			<div class="flex flex-col w-full gap-10">
				<div class="flex w-full items-center p-5">
					<div class="w-full flex flex-col px-2.5">
						<h2 class="font-bold text-[40px]">
							{{ 'tariffPlan.page.title' | translate }}
						</h2>
						<p class="font-normal text-base">
							{{ 'tariffPlan.page.subtitle' | translate }}
						</p>
					</div>
					<div class="flex shadow-sm bg-white h-[40px] rounded-[66px]">
						<button
							id="monthly-button"
							class="text-sm font-semibold font-inter px-5 py-[5px] rounded-[66px] h-[40px] transition-colors duration-300"
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType === billingCycleEnum.monthly}"
							(click)="toggleSubscription(billingCycleEnum.monthly)"
						>
							{{ 'keyword.capitalize.monthly' | translate }}
						</button>
						<button
							id="annual-button"
							class="text-sm font-semibold font-inter px-5 py-[5px] rounded-[66px] h-[40px] transition-colors duration-300"
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType === billingCycleEnum.yearly }"
							(click)="toggleSubscription(billingCycleEnum.yearly)">
							{{ 'keyword.capitalize.yearly' | translate }}
						</button>
					</div>
				</div>

				<div
					class="flex gap-5 p-5 flex-col lg:flex-row overflow-auto">

					@for (item of items; track item._id) {

						@if (item.billingCycle === subscriptionType) {

							<div
								class="flex justify-between min-w-[340px] flex-col h-[600px] transition-transform duration-300 bg-white shadow-lg rounded-2xl gap-5 px-5 py-3">
								<div class="flex flex-col">
									<div class="flex justify-between items-center mb-1">
										<h2 class="text-2xl font-bold text-[#FFD429] uppercase">
											{{ item.type }}
										</h2>
										@if (item.type === typeTariffPlanEnum.Free) {
											<p class="font-light text-xs">
												{{ 'keyword.capitalize.noNeedCard' | translate }}
											</p>
										}
									</div>
									<div class="flex justify-center">
										<div class="flex flex-col w-[250px]">
											<div class="flex items-center">
												<p class="flex font-bold mb-2 text-[64px] items-baseline gap-1">
													@if (billingCycleEnum.yearly === subscriptionType) {
														{{ item.prices[0].priceBreakdown.monthly | number: '1.0-0' }}
													} @else {
														{{ item.prices[0].value }}
													}
													<span class="font-bold mb-1 text-2xl mr-1.5">
													{{ item.prices[0].currency | currencyCode }}
												</span>
												</p>
												<div class="flex flex-col">
													@if (billingCycleEnum.yearly === subscriptionType) {
														<span
															class="font-medium text-sm text-[#CACACA]">per month</span>
													}
												</div>
											</div>
											<ul
												class="[&>li]:text-sm [&>li]:font-medium [&>li]:mb-1 [&>li]:h-[26px] [&>li]:flex [&>li]:items-center">
												<li class="flex gap-2 first:font-bold">
													<i class="bi bi-check-lg"></i>
													<span>Users {{ item.specialistLimit }}</span>
													@if (this.actual.tariffPlan.type === item.type) {
														@if (membersCount() === item.specialistLimit) {
															<span class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-gray-800 text-white">
															exhausted
														</span>
														} @else {
															<span class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-green-800 text-white">
															{{membersCount()}} / {{ item.specialistLimit ?? '∞' }}
														</span>
														}
													}
												</li>
												@for (feature of item.features; track feature) {
													<li class="flex gap-2">
														<i class="bi bi-check-lg"></i>
														<span>{{ ('tariffPlan.features.' + feature + '.label') | translate }}</span>
													</li>
												}
											</ul>
										</div>
									</div>
								</div>

								@if (this.actual.tariffPlan.type === item.type) {

									<button
										disabled
										class="font-bold text-xl py-4 px-5 text-neutral-400 w-full capitalize">
										{{ 'keyword.capitalize.chosen' | translate }}
									</button>

								} @else {

									<button
										class="bg-[#FFD429] font-bold text-xl py-4 px-5 hover:bg-[#FFC800] rounded-[10px] w-full capitalize">
										{{ 'keyword.capitalize.upgradeTo' | translate }} {{ item.type }}
									</button>

								}
							</div>

						}

					}

				</div>
			</div>
		</section>
		<section class="flex w-full items-center p-5">
			<div class="bg-white rounded-2xl p-1 w-full">
				<a href="#"
				   class="text-yellow-700 cursor-pointer hover:bg-yellow-100 rounded-2xl transition-all flex gap-2 p-3">
					<span>{{ 'tariffPlan.links.billing.label' | translate }}</span>
					<i class="bi bi-box-arrow-up-right"></i>
				</a>
			</div>
		</section>
		<section class="flex flex-col w-full p-5">
			<div class="bg-white rounded-2xl p-3 px-4 prose max-w-full"
				 [innerHTML]="'tariffPlan.documentation.switchingToAnotherPlan' | translate">
			</div>
		</section>
	`
})
export class MainTariffPlanComponent implements OnInit {

	private readonly sharedUow = inject(SharedUow);
	private readonly activatedRoute = inject(ActivatedRoute);
	public readonly items: ETariffPlan[] = this.activatedRoute.snapshot.data.tariffPlanItems;
	public readonly historyItems: ETariffPlanHistory[] = this.activatedRoute.snapshot.data.tariffPlanHistoryItems;
	public readonly actual: ETariffPlanHistory = this.activatedRoute.snapshot.data.tariffPlanActual;

	public readonly membersCount = signal(0);

	public ngOnInit() {
		this.sharedUow.member.count().then((count) => {
			this.membersCount.set(count);
		});
	}

	public readonly typeTariffPlanEnum = TypeTariffPlanEnum;
	public readonly billingCycleEnum = BillingCycleEnum;

	public subscriptionType: BillingCycleEnum = BillingCycleEnum.monthly;

	public toggleSubscription(type: BillingCycleEnum) {
		this.subscriptionType = type;
	}

}

export default MainTariffPlanComponent;
