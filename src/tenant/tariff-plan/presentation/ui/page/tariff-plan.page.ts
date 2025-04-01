import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import MainTariffPlanSmartComponent
	from "@tenant/tariff-plan/presentation/ui/component/smart/main.tariff-plan.smart.component";

@Component({
	selector: 'tariff-plan-page',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MainTariffPlanSmartComponent
	],
	template: `
		<main-tariff-plan-smart-component/>
	`
})
export class TariffPlanPage {

}

export default TariffPlanPage;
