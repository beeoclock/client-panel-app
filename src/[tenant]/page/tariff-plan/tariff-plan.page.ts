import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import MainTariffPlanComponent from "@tariffPlan/presentation/component/smart/main.tariff-plan.component";

@Component({
	selector: 'tariff-plan-page',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MainTariffPlanComponent
	],
	template: `
		<main-tariff-plan-component/>
	`
})
export class TariffPlanPage {

}

export default TariffPlanPage;
