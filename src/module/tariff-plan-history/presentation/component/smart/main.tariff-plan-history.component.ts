import {ChangeDetectionStrategy, Component, inject, OnInit, Signal, ViewEncapsulation} from "@angular/core";
import ETariffPlan from "@core/business-logic/tariif-plan/entity/e.tariff-plan";
import {CurrencyCodePipe} from "@utility/presentation/pipes/currency-code.pipe";
import {NgClass} from "@angular/common";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {
	TariffPlanHistoryStore
} from "@module/tariff-plan-history/infrastructure/store/tariff-plan-history/tariff-plane-history.store";

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
	`
})
export class MainTariffPlanHistoryComponent implements OnInit {

	private readonly sharedUow = inject(SharedUow);
	private readonly tariffPlanHistoryStore = inject(TariffPlanHistoryStore);
	public readonly items: Signal<ETariffPlan[]> = this.tariffPlanHistoryStore.items;

	public membersCount = 0;

	public ngOnInit() {
		this.sharedUow.member.count().then(count => this.membersCount = count);
	}

}

export default MainTariffPlanHistoryComponent;
