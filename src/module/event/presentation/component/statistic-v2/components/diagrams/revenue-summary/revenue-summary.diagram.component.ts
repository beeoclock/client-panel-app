import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
	inject,
	input,
	NgZone,
	OnDestroy,
	PLATFORM_ID,
	ViewEncapsulation
} from "@angular/core";

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import {PieChart, PieSeries} from "@amcharts/amcharts5/percent";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Kelly from '@amcharts/amcharts5/themes/Kelly';
import {CurrencyPipe, isPlatformBrowser, KeyValuePipe} from "@angular/common";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {Store} from "@ngxs/store";
import {ClientState} from "@client/state/client/client.state";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {IonicModule} from "@ionic/angular";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	standalone: true,
	selector: 'revenue-summary-diagram',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `

			<div class="flex gap-2 justify-between items-center max-w-full overflow-auto">
				<div>
					{{ 'analytic.widget.revenue.summary.label' | translate }}
				</div>
				<div class="text-black rounded-2xl bg-white px-3">
					<ion-select aria-label="Fruit" interface="popover" [formControl]="orderServiceStatusFormControl"
								placeholder="Select fruit">

						@for (status of (OrderServiceStatusEnum | keyvalue); track status.key) {

							<ion-select-option [value]="status.value">

								{{ ('event.keyword.status.plural.' + status.value) | translate }}
								&nbsp;&nbsp;
								{{ analytic().summary.revenue.total.by.status[status.value][baseCurrency] | currency: baseCurrency: 'symbol-narrow' }}

							</ion-select-option>

						}

					</ion-select>
				</div>
			</div>
			<div class="rounded-2xl bg-white p-2 flex flex-wrap gap-2 justify-center max-w-full overflow-auto">

				<ion-segment [formControl]="showMoneyOrCountFormControl">
					<ion-segment-button [value]="true">
						<ion-label>{{ 'analytic.widget.revenue.summary.by.form.kind.money' | translate }}</ion-label>
					</ion-segment-button>
					<ion-segment-button [value]="false">
						<ion-label>{{ 'analytic.widget.revenue.summary.by.form.kind.count' | translate }}</ion-label>
					</ion-segment-button>
				</ion-segment>
				<div id="chartdiv" style="width: 488px; height: 200px"></div>
			</div>
			<div class="text-neutral-400 text-sm">
				{{ 'analytic.widget.revenue.summary.description' | translate }}
			</div>
	`,
	imports: [
		CurrencyPipe,
		KeyValuePipe,
		IonicModule,
		ReactiveFormsModule,
		TranslatePipe
	],
	host: {
		class: 'block max-w-full rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2'
	}
})
export class RevenueSummaryDiagramComponent extends Reactive implements AfterViewInit, OnDestroy {

	public readonly analytic = input.required<Analytic.I>();

	private root!: am5.Root;

	private readonly platformId = inject(PLATFORM_ID);
	private readonly zone = inject(NgZone);
	private readonly store = inject(Store);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	protected readonly baseCurrency = this.store.selectSnapshot(ClientState.baseCurrency) ?? CurrencyCodeEnum.USD;

	protected readonly OrderServiceStatusEnum = OrderServiceStatusEnum;

	protected readonly orderServiceStatusFormControl = new FormControl(OrderServiceStatusEnum.done, {
		nonNullable: true
	});
	protected readonly showMoneyOrCountFormControl = new FormControl<boolean>(true, {
		nonNullable: true
	}); // true - money, false count

	public constructor() {
		super();
		// Register a new effect.
		effect(() => {
			this.buildPieChart();
		});
	}

	// Run the function only in the browser
	public browserOnly(f: () => void) {
		if (isPlatformBrowser(this.platformId)) {
			this.zone.runOutsideAngular(() => {
				f();
			});
		}
	}

	public ngAfterViewInit() {

		this.buildPieChart();
		this.orderServiceStatusFormControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe(() => {
			this.buildPieChart();
			this.changeDetectorRef.detectChanges();
		});
		this.showMoneyOrCountFormControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe(() => {
			this.buildPieChart();
			this.changeDetectorRef.detectChanges();
		});
	}

	public buildPieChart() {

		// Chart code goes in here
		this.browserOnly(() => {

			this.root?.dispose();

			const root = am5.Root.new("chartdiv");

			root.setThemes([
				am5themes_Animated.new(root),
				am5themes_Kelly.new(root)
			]);

			// Create chart
			// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
			const chart = root.container.children.push(PieChart.new(root, {
				radius: am5.percent(90),
				innerRadius: am5.percent(50),
				layout: root.horizontalLayout
			}));

			// Create series
			// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
			const series = chart.series.push(PieSeries.new(root, {
				name: "Series",
				valueField: "value",
				categoryField: "name",
				legendLabelText: "[{fill}] {category}[/]",
				legendValueText: "[bold {fill}]{value}[/] \n [{fill}]{valuePercentTotal.formatNumber('0.00p')}[/]"
			}));

			// Set data
			// https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
			series.data.setAll(this.extractDataForPie());

			// Disabling labels and ticks
			series.labels.template.set("visible", false);
			series.ticks.template.set("visible", false);

			// Create legend
			// https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
			const legend = chart.children.push(am5.Legend.new(root, {
				centerY: am5.percent(50),
				y: am5.percent(50),
				layout: root.verticalLayout,
			}));

			// set value labels align to right
			legend.valueLabels.template.setAll({
				textAlign: "right",
			})

			// set width and max width of labels
			legend.labels.template.setAll({
				maxWidth: 140,
				width: 140,
				oversizedBehavior: "wrap"
			});

			legend.data.setAll(series.dataItems);

			// Play initial series animation
			// https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
			series.appear(1000, 100);

			this.root = root;
		});
	}

	public override ngOnDestroy() {
		// Clean up chart when the component is removed
		this.browserOnly(() => {
			if (this.root) {
				this.root.dispose();
			}
		});
		super.ngOnDestroy();
	}

	public extractDataForPie() {
		const analytic = this.analytic();

		// Extract data from the analytic for the pie chart, take total and from each specialist total information
		const data: {
			name: string;
			value: number;
		}[] = [];

		const orderServiceStatus = this.orderServiceStatusFormControl.value;
		const moneyOrCount = this.showMoneyOrCountFormControl.value;

		Object.values(analytic.specialistRecord).forEach((specialist) => {

			let value = specialist.summary.revenue.total.by.status[orderServiceStatus][this.baseCurrency];

			if (!moneyOrCount) {

				value = specialist.counter.orderService.by.status[orderServiceStatus];

			}

			data.push({
				name: specialist.details.firstName + ' ' + specialist.details.lastName,
				value
			});
		});

		return data;
	}
}
