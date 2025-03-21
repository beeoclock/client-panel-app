import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	resource,
	ResourceRef,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {
	PostTenantTariffPlanChangeAmountApi
} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.change-amount.api";
import {CurrencyPipe} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan";
import {TranslatePipe} from "@ngx-translate/core";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'app-confirm-change-tariff-plan-component',
	standalone: true,
	host: {
		class: 'p-4 flex flex-col justify-between gap-4 h-full overflow-auto'
	},
	template: `

		<div class="prose">
			<h1>
				{{ 'tariffPlan.modal.confirm-changes.title' | translate }}
			</h1>
		</div>


		<div class="flex-1 flex flex-col gap-4">
			@if (resource.isLoading()) {

				<div class="flex-1 flex items-center justify-center">
					<utility-loader/>
				</div>

			} @else {

				@if (resource.value(); as changes) {
					<!-- List Group -->
					<ul class="flex flex-col">

						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.currentTariffPlan.label' | translate }}:</span>
								<span>{{ currentTariffPlan().tariffPlan.type }}</span>
							</div>
						</li>
						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.newTariffPlan.label' | translate }}:</span>
								<span>{{ tariffPlan().type }}</span>
							</div>
						</li>

					</ul>
					<!-- End List Group -->

						<!-- List Group -->
					<ul class="flex flex-col">


						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.currentTariffPlan.daysUsed.label' | translate }}:</span>
								<span>{{ changes.daysUsed }}</span>
							</div>
						</li>
						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.currentTariffPlan.daysRemaining.label' | translate }}:</span>
								<span>{{ changes.daysRemaining }}</span>
							</div>
						</li>
						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.currentTariffPlan.remainingCredit.label' | translate }}:</span>
								<span>{{ changes.leftoverCreditInCent }}</span>
							</div>
						</li>

						<li class="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div class="flex items-center justify-between w-full">
								<span>{{ 'tariffPlan.modal.confirm-changes.content.newTariffPlan.differenceToPay.label' | translate }}:</span>
								<span>
								{{ (changes.differenceToPayInCent / 100) | currency: changes.currency: 'symbol': '1.2-2' }}
							</span>
							</div>
						</li>
					</ul>
					<!-- End List Group -->

					<div class="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-lg p-4" role="alert"
						 tabindex="-1" aria-labelledby="hs-link-on-right-label">
						<div class="flex">
							<div class="flex-1 flex-col gap-2 flex md:justify-between ms-2">
								<p id="hs-link-on-right-label" class="text-sm">
									{{ 'tariffPlan.modal.confirm-changes.content.additional.one' | translate }}
								</p>
								<p id="hs-link-on-right-label" class="text-sm">
									{{ 'tariffPlan.modal.confirm-changes.content.additional.two' | translate }}
								</p>
							</div>
						</div>
					</div>

				} @else {

				}
			}

		</div>

		<div class="flex justify-between">
			<button type="button"
					(click)="cancel()"
					class="py-3 px-4 inline-flex items-center gap-x-2 font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
				{{ 'keyword.capitalize.cancel' | translate }}
			</button>
			<button
				[disabled]="loading() || resource.isLoading()"
				(click)="confirm()"
				type="button"
				class="py-3 px-4 inline-flex items-center gap-x-2 font-medium rounded-full border border-transparent bg-[#FFD429] text-black hover:bg-[#FFC800] focus:outline-hidden focus:bg-yellow-700 disabled:opacity-50 disabled:pointer-events-none">

				@if (loading()) {
					<span class="animate-spin">
						<i class="bi bi-arrow-repeat"></i>
					</span>
				} @else {

					{{ 'keyword.capitalize.confirm' | translate }}
				}
			</button>
		</div>
    `,
	imports: [
		CurrencyPipe,
		LoaderComponent,
		TranslatePipe,
	],
	providers: [
		PostTenantTariffPlanChangeAmountApi.Request,
	]
})
export class ConfirmChangeTariffPlanComponent {

	public readonly closeModal = input.required<(result: boolean) => void>();
	public readonly tariffPlan = input.required<ITariffPlan.DTO>();
	public readonly currentTariffPlan = input.required<ITariffPlanHistory.DTO>();

	public readonly loading = signal(false);

	private readonly PostTenantTariffPlanChangeAmountApiRequest = inject(PostTenantTariffPlanChangeAmountApi.Request);
	private readonly tariffPlanStore = inject(TariffPlanStore);

	public readonly resource: ResourceRef<PostTenantTariffPlanChangeAmountApi.RESPONSE | undefined> = resource({
		request: () => ({
			tariffPlan: this.tariffPlan(),
		}),
		loader: async ({request: {tariffPlan}}) => {
			const result = await this.PostTenantTariffPlanChangeAmountApiRequest.executeAsync(tariffPlan);
			return result;
		}
	});

	public cancel() {
		this.closeModal()(false);
	}

	public async confirm() {
		this.loading.set(true);
		const tariffPlanEntity = ETariffPlan.fromRaw(this.tariffPlan());
		await this.tariffPlanStore.changeTariffPlanOnto(tariffPlanEntity);
		this.loading.set(false);
	}

}
