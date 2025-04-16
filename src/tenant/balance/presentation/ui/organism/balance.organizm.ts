import {ChangeDetectionStrategy, Component, inject, signal, Signal, ViewEncapsulation} from "@angular/core";
import {balanceStore} from "@tenant/balance/presentation/store/balance.store";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {CurrencyPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {TariffPlanStore} from "@tenant/tariff-plan/tariff-plan/infrastructure/store/tariff-plan/tariff-plane.store";
import {WINDOW} from "@core/cdk/window.provider";

@Component({
	selector: 'balance-organizm',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	providers: [balanceStore],
	imports: [
		CurrencyPipe,
		TranslatePipe,
	],
	template: `

		@if (balance(); as balance) {

			<div class="p-4 flex gap-4">

				<div>
					<div class="text-xs text-neutral-500">
						{{ 'sidebar.balance' | translate }}
					</div>
					<div class="text-2xl font-bold" [class.text-red-600]="balance.amountIsNegative()" [class.text-green-600]="!balance.amountIsNegative()">
						{{ balance.amountAfterAction | currency: balance.currency : 'symbol-narrow' }}
					</div>

					<button
						(click)="openBillingLink()"
						[disabled]="billingLinkIsLoading()"
						class="text-blue-700 hover:text-blue-800 hover:underline cursor-pointer transition-all gap-2 flex text-xs">
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

		}

	`
})
export class BalanceOrganizm {

	private readonly balanceStore = inject(balanceStore);
	private readonly tariffPlanStore = inject(TariffPlanStore);
	private readonly window = inject(WINDOW);

	public readonly balance: Signal<EBalance | null> = this.balanceStore.balance;
	public readonly billingLinkIsLoading = signal(false);

	public openBillingLink() {
		this.billingLinkIsLoading.set(true);
		this.tariffPlanStore.fetchBillingLink().then(() => {
			const billingLink = this.tariffPlanStore.billingLink();
			if (billingLink) {
				this.window.open(billingLink, '_blank');
				return;
			}
		}).finally(() => {
			this.billingLinkIsLoading.set(false);
		});
	}

}
