import {ChangeDetectionStrategy, Component, inject, Signal, ViewEncapsulation} from "@angular/core";
import {balanceStore} from "@tenant/balance/presentation/store/balance.store";
import EBalance from "@tenant/balance/domain/entity/e.balance";
import {CurrencyPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

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
				</div>

			</div>

		}

	`
})
export class BalanceOrganizm {

	private readonly balanceStore = inject(balanceStore);

	public readonly balance: Signal<EBalance | null> = this.balanceStore.balance;

}
