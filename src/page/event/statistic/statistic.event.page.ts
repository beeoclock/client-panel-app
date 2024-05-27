import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {StatisticComponent} from "@event/presentation/component/statistic/statistic.component";

@Component({
	selector: 'app-event-statistic-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		StatisticComponent
	],
	template: `
		<event-statistic-component/>
	`
})
export default class StatisticEventPage {

}
