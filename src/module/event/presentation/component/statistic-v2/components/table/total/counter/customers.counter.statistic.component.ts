import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, KeyValuePipe} from "@angular/common";
import {
	StatusIconComponent
} from "@page/event/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.icon.component";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";

@Component({
	selector: 'customers-counter-statistic-component',
	template: `

		<div class="rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2">
			<div class="uppercase text-neutral-400 flex gap-2">
				<div>
					<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-person-vcard"></i>
				</div>
				<span>Клієнтів за період</span>
			</div>
			<div class="rounded-2xl bg-white p-2 flex gap-2 justify-center flex-col text-center">
				<div class="text-2xl font-bold">{{ analytic().counter.customers }}</div>
			</div>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		KeyValuePipe,
		CurrencyPipe,
		StatusIconComponent
	]
})
export class CustomersCounterStatisticComponent {

	public readonly analytic = input.required<Analytic.I | Analytic.ISpecialist>();

}
