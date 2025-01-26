import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
	inject,
	input,
	ViewEncapsulation
} from "@angular/core";
import {DecimalPipe} from "@angular/common";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	selector: 'services-counter-statistic-component',
	template: `

		<div class="text-neutral-400 flex gap-2">
			<div>
				<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-emoji-smile"></i>
			</div>
			<span class="uppercase">
				{{ 'analytic.widget.total.counter.services.title' | translate }}
			</span>
		</div>
		<div class="text-sm text-neutral-400">
			{{ 'analytic.widget.total.counter.description.title' | translate }}
		</div>
		<div class="rounded-2xl bg-white flex justify-center flex-col text-center">
			<div class="text-2xl font-bold p-2 border-b">{{ analytic().counter.services }}</div>

			<ul class="max-h-52 w-full flex flex-col overflow-auto divide-y rounded-b-2xl">
				@for (service of services; track service.details.id) {

					<li class="flex justify-between w-full py-1 px-2">
						<div class="flex gap-2">
							@if ($index === 0) {
								<!--  Gold -->
								<div class="text-yellow-400">
									<i class="bi bi-trophy"></i>
								</div>
							}
							@if ($index === 1) {
								<!--  Silver -->
								<div class="text-gray-400">
									<i class="bi bi-trophy"></i>
								</div>
							}
							@if ($index === 2) {
								<!--  Bronze -->
								<div class="text-orange-400">
									<i class="bi bi-trophy"></i>
								</div>
							}
							{{ service.details.serviceName }}
						</div>
						<div class="flex gap-2">
							<div class="w-12">{{ service.counter.orderService.total }}</div>

							@if (servicePercentageMap.get(service.details.id); as percentage) {
								<div class="text-sm text-neutral-500 w-12">

									{{ percentage.orderServicePercentage | number: '1.0-2' }}%
								</div>
							}
						</div>
					</li>

				}
			</ul>

		</div>

	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DecimalPipe,
		TranslatePipe
	],
	host: {
		class: 'rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2 w-full h-full'
	}
})
export class ServicesCounterStatisticComponent {

	public readonly analytic = input.required<Analytic.I | Analytic.ISpecialist>();

	public services: (Analytic.IService | Omit<Analytic.IService, 'specialistRecord'>)[] = [];
	public readonly servicePercentageMap = new Map<string, {
		orderServicePercentage: number;
	}>();

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public constructor() {
		effect(() => {
			this.prepareData();
		});
	}

	private prepareData() {

		this.services = Object.values(this.analytic().serviceRecord)
			.sort((a, b) => {
				return b.counter.orderService.total - a.counter.orderService.total;
			});

		this.servicePercentageMap.clear();

		this.services.forEach(service => {
			this.servicePercentageMap.set(service.details.id, {
				orderServicePercentage: service.counter.orderService.total / this.analytic().counter.orderService.total * 100
			});
		});

		this.changeDetectorRef.detectChanges();

	}

}
