import {ChangeDetectionStrategy, Component, inject, OnInit, Signal, ViewEncapsulation} from "@angular/core";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {TypeTariffPlanEnum} from "@core/business-logic/tariif-plan/enum/type.tariff-plan.enum";
import {CurrencyCodePipe} from "@utility/presentation/pipes/currency-code.pipe";
import {NgClass} from "@angular/common";
import {SharedUow} from "@core/shared/uow/shared.uow";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'main-tariff-plan-component',
	imports: [
		CurrencyCodePipe,
		NgClass
	],
	template: `
		<section id="tariffs"
				 class="flex w-full justify-center items-center lg:min-h-[810px] phone:py-10 phone:px-5 lg:px-5 xl:px-0">
			<div class="flex flex-col w-full max-w-[1080px] gap-10 phone:gap-3">
				<div class="flex w-full items-center phone:flex-col phone:items-start phone:gap-2.5">
					<div class="w-full flex flex-col px-2.5">
						<h2 class="font-bold text-[40px]">Tariffs</h2>
						<p class="font-normal text-base">Choose the best option for your business</p>
					</div>
					<div class="flex shadow-sm bg-white h-[40px] rounded-[66px]">
						<button
							id="monthly-button"
							class="text-sm font-semibold font-inter px-5 py-[5px] rounded-[66px] h-[40px] transition-colors duration-300"
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType === 'monthly'}"
							(click)="toggleSubscription('monthly')"
						>
							Monthly
						</button>
						<button
							id="annual-button"
							class="text-sm font-semibold font-inter px-5 py-[5px] rounded-[66px] h-[40px] transition-colors duration-300"
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType === 'annual' }"
							(click)="toggleSubscription('annual')">
							Annual
						</button>
					</div>
				</div>

				<div
					class="flex gap-5 p-5 flex-col lg:flex-row">

					@for (item of items(); track item._id) {

						<div
							class="flex justify-between flex-col h-[600px] transition-transform duration-300 bg-white shadow-lg rounded-2xl gap-5 px-5 py-3 w-full">
							<div class="flex flex-col">
								<div class="flex justify-between items-center mb-1">
									<h2 class="text-2xl font-bold text-[#FFD429] uppercase">
										{{ item.type }}
									</h2>
									@if (item.type === typeTariffPlanEnum.Free) {
										<p class="font-light text-xs">No need card</p>
									}
								</div>
								<div class="flex justify-center">
									<div class="flex flex-col w-[250px]">
										<div class="flex items-center">
											<p class="flex font-bold mb-2 text-[64px] items-baseline gap-1">
												{{ item.prices[0].value }}
												<span class="font-bold mb-1 text-2xl mr-1.5">
													{{ item.prices[0].currency | currencyCode }}
												</span>
											</p>
											<div class="flex flex-col">
												<span class="font-medium text-sm text-[#CACACA]">per business</span>
												<span class="font-medium text-sm text-[#CACACA]">per month</span>
											</div>
										</div>
										<ul
											class="[&>li]:text-sm [&>li]:font-medium [&>li]:mb-1 [&>li]:h-[26px] [&>li]:flex [&>li]:items-center">
											<li class="flex gap-2 first:font-bold">
												<i class="bi bi-check-lg"></i>
												<span>Users {{ item.specialistLimit }} {{ membersCount }}</span>
											</li>
											@for (feature of item.features; track feature) {
												<li class="flex gap-2">
													<i class="bi bi-check-lg"></i>
													<span>{{ feature }}</span>
												</li>
											}
										</ul>
									</div>
								</div>
							</div>
							<button
								class="bg-[#FFD429] font-bold text-xl py-4 px-5 transition-all duration-150 ease-in-out active:scale-95 hover:bg-[#FFC800] rounded-[10px] w-full uppercase">
								Get Started
							</button>
						</div>

					}

				</div>
			</div>
		</section>
		<section class="flex w-full items-center p-5">
			<div class="bg-white rounded-2xl p-1 w-full">
				<a href="#"
				   class="text-yellow-700 cursor-pointer hover:bg-yellow-100 rounded-2xl transition-all flex gap-2 p-3">
					<span>Billing history and linked payment cards</span>
					<i class="bi bi-box-arrow-up-right"></i>
				</a>
			</div>
		</section>
		<section class="flex flex-col w-full p-5">
			<div class="bg-white rounded-2xl p-3 px-4 prose max-w-full">
				<p>
					<strong>Switching to Another Plan</strong>
				</p>
				<p>
					Upgrading or changing your plan is seamless! When you switch to a new plan, the system will
					automatically
					calculate the difference between your current and new plan, ensuring a smooth transition.
				</p>
				<p>
					🔹 How It Works:
				</p>
				<ol>
					<li>Instant Activation – Your new plan will be activated immediately after the change.</li>
					<li>Pro-rated Adjustment – The system will deduct the remaining value from your previous plan and
						apply it to
						the new one.
					</li>
					<li>Automatic Billing – You’ll only pay the difference, ensuring you’re charged fairly.</li>
					<li>No Service Disruptions – Your existing features remain active while the upgrade is processed.
					</li>
				</ol>
				<p>💡 You can upgrade anytime and only pay for what you use. If you downgrade, the adjusted amount will
					be
					applied to future payments. 🚀</p>
			</div>
		</section>
    `
})
export class MainTariffPlanComponent implements OnInit {

	private readonly sharedUow = inject(SharedUow);
	private readonly tariffPlanStore = inject(TariffPlanStore);
	public readonly items: Signal<ETariffPlan[]> = this.tariffPlanStore.items;

	public membersCount = 0;

	public ngOnInit() {
		this.sharedUow.member.count().then(count => this.membersCount = count);
	}

	public readonly typeTariffPlanEnum = TypeTariffPlanEnum;

	public subscriptionType: 'monthly' | 'annual' = 'monthly';

	public toggleSubscription(type: 'monthly' | 'annual') {
		this.subscriptionType = type;
	}

}
export default MainTariffPlanComponent;
