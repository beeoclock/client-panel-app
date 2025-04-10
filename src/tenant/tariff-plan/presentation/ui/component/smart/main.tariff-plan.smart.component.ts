import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	OnInit,
	Signal,
	signal,
	ViewEncapsulation
} from "@angular/core";
import ETariffPlan from "@tenant/tariff-plan/domain/entity/e.tariff-plan";
import {TypeTariffPlanEnum} from "@core/shared/enum/type.tariff-plan.enum";
import {CurrencyCodePipe} from "@shared/presentation/pipes/currency-code.pipe";
import {DecimalPipe, NgClass} from "@angular/common";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {BillingCycleEnum} from "@core/shared/enum/billing-cycle.enum";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import ETariffPlanHistory from "@tenant/tariff-plan-history/domain/entity/e.tariff-plan-history";
import {TariffPlanStore} from "@tenant/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";
import {ITariffPlan} from "@tenant/tariff-plan/domain/interface/i.tariff-plan";
import {LanguageCodeEnum} from "@core/shared/enum";
import {
	TariffPlanHistoryStore
} from "@tenant/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";
import {
	ConfirmChangeTariffPlanModalController
} from "@tenant/tariff-plan/presentation/ui/component/modal/confirm-change-tariff-plan/confirm-change-tariff-plan.modal.controller";
import {ModalController, ToastController} from "@ionic/angular/standalone";

@Component({
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'main-tariff-plan-smart-component',
	imports: [
		CurrencyCodePipe,
		NgClass,
		TranslatePipe,
		DecimalPipe,
	],
	providers: [
		ModalController,
		ConfirmChangeTariffPlanModalController,
	],
	template: `
		<section id="tariffs"
				 class="flex w-full justify-center items-center">
			<div class="flex flex-col w-full gap-10">
				<div class="flex w-full items-center gap-4 px-5 pt-5 md:p-5 flex-col md:flex-row">
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
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType() === billingCycleEnum.monthly}"
							(click)="setSubscriptionType(billingCycleEnum.monthly)"
						>
							{{ 'keyword.capitalize.monthly' | translate }}
						</button>
						<button
							id="annual-button"
							class="text-sm font-semibold font-inter px-5 py-[5px] rounded-[66px] h-[40px] transition-colors duration-300"
							[ngClass]="{ 'bg-[#E5E5E5]': subscriptionType() === billingCycleEnum.yearly }"
							(click)="setSubscriptionType(billingCycleEnum.yearly)">
							{{ 'keyword.capitalize.yearly' | translate }}
						</button>
					</div>
				</div>

				<div
					class="flex gap-5 p-5 flex-col lg:flex-row overflow-auto">

					@for (item of items; track item._id) {


						<div
							class="flex justify-between min-w-[300px] flex-col h-[600px] transition-transform duration-300 bg-white shadow-lg rounded-2xl gap-5 px-3 py-3">
							<div class="flex flex-col">
								<div class="flex px-2 justify-between items-center mb-1">
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
										<div class="flex flex-col justify-center">
											@if (item.type !== typeTariffPlanEnum.Free) {
												@if (subscriptionType() === billingCycleEnum.yearly) {
													<div class="flex gap-2 mt-2">
														<p class="flex font-bold gap-1 line-through">
															{{ (item.prices[0].values[0].beforeDiscount / 12) | number: '1.0-0' }}
															{{ item.prices[0].currency | currencyCode }}
														</p>
														<span
															class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-red-600 text-white">
															{{ item.prices[0].values[0].discountPercentage }}%
														</span>
													</div>
												}
											}
											<div class="flex items-center gap-1">
												<p class="flex font-bold text-[64px] items-baseline gap-1">
													@if (subscriptionType() === billingCycleEnum.yearly) {
														{{ (item.prices[0].values[0].afterDiscount / 12) | number: '1.0-0' }}
													} @else {
														{{ item.prices[0].values[0].afterDiscount | number: '1.0-0' }}
													}
													<span class="font-bold mb-1 text-2xl mr-1.5">
													{{ item.prices[0].currency | currencyCode }}
												</span>
												</p>
												<div class="flex flex-col">
													@if (item.type !== typeTariffPlanEnum.Free) {
														@if (billingCycleEnum.yearly === subscriptionType()) {
															<span
																class="font-medium text-sm text-[#CACACA]">per month</span>
														}
													}
												</div>
											</div>
										</div>
										<ul class="[&>li]:text-sm [&>li]:font-medium [&>li]:mb-1 [&>li]:h-[26px] [&>li]:flex [&>li]:items-center">
											<li class="flex gap-2 first:font-bold">
												<i class="bi bi-check-lg"></i>
												<span>{{ 'keyword.capitalize.members' | translate }} {{ item.specialistLimit ?? '∞' }}</span>
												@if (this.effectivePlan(); as actual) {
													@if (actual.tariffPlan.type === item.type) {
														@if (membersCount() === item.specialistLimit) {
															<span
																class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-gray-800 text-white">
																{{ 'keyword.capitalize.exhausted' | translate }}
															</span>
														} @else {
															<span
																class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-green-800 text-white">
																{{ membersCount() }} / {{ item.specialistLimit ?? '∞' }}
															</span>
														}
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
							@if (this.effectivePlan(); as actual) {

								@if (isTheSameTariffPlan(item, actual.tariffPlan)) {

									<button
										disabled
										class="font-bold text-xl py-4 px-5 text-neutral-400 w-full normal-case">
										{{ 'keyword.capitalize.chosen' | translate }}
									</button>

								} @else {

									@if (loading()?._id === item._id) {

										<button
											disabled
											class="text-xl bg-[#FFD429] rounded-2xl text-yellow-900 py-4 px-2 w-full">
											<div class="animate-spin">
												<i class="bi bi-arrow-repeat"></i>
											</div>
										</button>

									} @else {

										@if (isUpgrade(item)) {

											<button
												(click)="upgradeTo(item)"
												class="bg-[#FFD429] font-bold text-xl py-4 px-2 hover:bg-[#FFC800] rounded-2xl w-full normal-case">
												{{ 'keyword.capitalize.upgradeTo' | translate }} {{ item.type }}
											</button>

										} @else {

											@if (actual.tariffPlan.type === item.type) {

												<button
													(click)="upgradeTo(item)"
													class="font-bold text-xl py-4 px-2 w-full normal-case">
													{{ 'keyword.capitalize.switchTo' | translate }} {{ item.type }}
												</button>

											} @else {

												<button
													(click)="upgradeTo(item)"
													class="font-bold text-xl py-4 px-2 w-full normal-case">
													{{ 'keyword.capitalize.downgradeTo' | translate }} {{ item.type }}
												</button>

											}

										}

									}

								}
							}
						</div>

					}

				</div>
			</div>
		</section>
		<section class="flex w-full items-center p-5">
			<div>
				<div class="bg-white rounded-2xl p-1 w-full">
					<button
						(click)="openBillingLink()"
						[disabled]="billingLinkIsLoading()"
						class="text-yellow-700 cursor-pointer hover:bg-yellow-100 rounded-2xl transition-all flex gap-2 p-3">
						<span>{{ 'tariffPlan.links.billing.label' | translate }}</span>
						@if (billingLinkIsLoading()) {
							<span class="animate-spin">
								<i class="bi bi-arrow-repeat"></i>
							</span>
						} @else {
							<i class="bi bi-box-arrow-up-right"></i>
						}
					</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col w-full p-5">
			<div class="bg-white rounded-2xl p-3 px-4 prose max-w-full"
				 [innerHTML]="'tariffPlan.documentation.switchingToAnotherPlan' | translate">
			</div>
		</section>
	`
})
export class MainTariffPlanSmartComponent implements OnInit {

	private readonly tariffPlanStore = inject(TariffPlanStore);
	private readonly confirmChangeTariffPlanModalController = inject(ConfirmChangeTariffPlanModalController);
	private readonly tariffPlanHistoryStore = inject(TariffPlanHistoryStore);
	private readonly toastController = inject(ToastController);
	private readonly sharedUow = inject(SharedUow);
	private readonly translateService = inject(TranslateService);
	private readonly activatedRoute = inject(ActivatedRoute);
	public readonly historyItems: ETariffPlanHistory[] = this.activatedRoute.snapshot.data.tariffPlanHistoryItems;
	public readonly effectivePlan: Signal<ETariffPlanHistory | null> = this.tariffPlanHistoryStore.effectivePlan;
	public readonly country: CountryCodeEnum = this.activatedRoute.snapshot.data.country;
	public readonly baseLanguage: LanguageCodeEnum = this.activatedRoute.snapshot.data.baseLanguage;
	public readonly items: ETariffPlan[] = [];

	readonly #items: ETariffPlan[] = this.activatedRoute.snapshot.data.tariffPlanItems;

	public readonly billingLinkIsLoading = signal(false);
	public readonly membersCount = signal(0);
	public readonly loading = signal<null | ETariffPlan>(null);

	public ngOnInit() {
		this.sharedUow.member.count().then((count) => {
			this.membersCount.set(count);
		});
		this.prepareItems();
	}

	public async upgradeTo(item: ETariffPlan) {
		this.loading.set(item);
		const actual = this.effectivePlan();
		if (actual) {
			const modal = await this.confirmChangeTariffPlanModalController.present(item, actual);
			modal.onDidDismiss().then((result) => {
				if (result.data) {
					this.showSuccessToast();
				}
			})
		} else {
			// TODO: Show Error
		}

		this.loading.set(null);
	}

	public openBillingLink() {
		this.billingLinkIsLoading.set(true);
		this.tariffPlanStore.fetchBillingLink().then(() => {
			const billingLink = this.tariffPlanStore.billingLink();
			if (billingLink) {
				window.open(billingLink, '_blank');
				return;
			}
		}).finally(() => {
			this.billingLinkIsLoading.set(false);
		});
	}

	private showSuccessToast() {
		const message = this.translateService.instant('tariffPlan.message.change.success');
		this.toastController.create({
			message,
			duration: 3000,
			color: 'success',
		}).then((toast) => {
			toast.present().then();
		});
	}

	public isUpgrade(item: ETariffPlan): boolean {
		return item.prices[0].values[0].beforeDiscount > (this.effectivePlan()?.tariffPlan.prices[0].values[0].beforeDiscount ?? 0)
	}

	public readonly typeTariffPlanEnum = TypeTariffPlanEnum;
	public readonly billingCycleEnum = BillingCycleEnum;

	public constructor() {
		effect(() => {
			const actual = this.effectivePlan();
			if (actual) {
				this.subscriptionType.set(actual.tariffPlan.prices[0].values[0].billingCycle);
			}
		});
	}

	public readonly subscriptionType = signal(BillingCycleEnum.monthly);

	public setSubscriptionType(type: BillingCycleEnum) {
		this.subscriptionType.set(type);
		this.prepareItems();
	}

	private prepareItems() {
		this.items.length = 0;
		const country = this.country;
		const language = this.baseLanguage;
		this.#items.forEach((item) => {
			const priceForSubscriptionTypeAndCountry = this.takePriceForParams({
				item,
				subscriptionType: this.subscriptionType(),
				country,
				language,
			});
			if (!priceForSubscriptionTypeAndCountry.length) {
				return;
			}
			const price = this.chooseOnlyTheMostSuitablePrice(priceForSubscriptionTypeAndCountry, country);
			if (!price) {
				return;
			}
			const prices = [price];
			const entity = ETariffPlan.fromRaw({
				...item,
				prices,
			});
			this.items.push(entity);
		});
	}

	/**
	 * The more specific the country, the better
	 * @param prices
	 * @param country
	 * @private
	 */
	private chooseOnlyTheMostSuitablePrice(prices: ITariffPlan.IPrice[], country: CountryCodeEnum): ITariffPlan.IPrice | undefined {
		let foundPrice = undefined;

		for (const price of prices) {
			if (price.country === country) {
				foundPrice = price;
				break;
			}
			if (foundPrice) {
				if (regionsPriority[price.region] < regionsPriority[foundPrice.region]) {
					foundPrice = price;
				}
			} else {
				foundPrice = price;
			}
		}

		return foundPrice;
	}

	private takePriceForParams(params: {
		item: ETariffPlan;
		subscriptionType: BillingCycleEnum;
		country: CountryCodeEnum;
		language: LanguageCodeEnum;
	}) {
		const {item, subscriptionType, country, language} = params;
		return item.prices.reduce((acc, price) => {
			if (price.country !== country) {
				if (price.country) {
					return acc;
				}
				const thePriceCountryIsInRegions = regionsWithCountryCodeRecord[price.region].includes(country);
				if (!thePriceCountryIsInRegions) {
					return acc;
				}
			}
			const takeCurrentSubscriptionType = price.values.filter((value) => {
				return value.billingCycle === subscriptionType;
			});
			const languageVersions = price.languageVersions.filter((languageVersion) => {
				return languageVersion.language === language;
			})
			if (takeCurrentSubscriptionType.length) {
				acc.push({
					...price,
					values: takeCurrentSubscriptionType,
					languageVersions,
				});
			}
			return acc;
		}, <ITariffPlan.IPrice[]>[]);
	}

	public isTheSameTariffPlan(item: ETariffPlan, actualTariffPlan: ITariffPlan.DTO): boolean {
		const {prices: {0: {values: {0: {billingCycle}}}}, type} = actualTariffPlan;
		if (this.subscriptionType() === billingCycle) {
			return item.type === type;
		}
		if (item.type === TypeTariffPlanEnum.Free && type === TypeTariffPlanEnum.Free) {
			return true;
		}
		return false;
	}
}

export default MainTariffPlanSmartComponent;

enum RegionEnum {
	EU = 'EU',
	WORLD = 'WORLD',
}

const regionsWithCountryCodeRecord = {
	[RegionEnum.EU]: [
		CountryCodeEnum.PL,
		CountryCodeEnum.DK,
	],
	[RegionEnum.WORLD]: [
		CountryCodeEnum.UA,
	],
}

const regionsPriority = {
	[RegionEnum.EU]: 0,
	[RegionEnum.WORLD]: 1,
};
