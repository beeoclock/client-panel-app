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

import * as am5 from '@amcharts/amcharts5';
import {PieChart, PieSeries} from "@amcharts/amcharts5/percent";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Kelly from '@amcharts/amcharts5/themes/Kelly';
import {isPlatformBrowser} from "@angular/common";
import {Analytic} from "@tenant/analytic/presentation/store/date-range-report/interface/i.analytic";
import {Store} from "@ngxs/store";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Reactive} from "@core/cdk/reactive";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ApplicationEnum} from "@core/shared/enum/application.enum";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {IonLabel, IonSegment, IonSegmentButton, IonSelect, IonSelectOption} from "@ionic/angular/standalone";

@Component({
	standalone: true,
	selector: 'total-revenue-diagram',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `

		<div class="flex gap-2 justify-between items-center max-w-full overflow-auto">
			<div>
				{{ 'analytic.widget.revenue.summary.by.form.source.label' | translate }}
			</div>
			<div class="text-black rounded-2xl bg-white px-3">
				<ion-select aria-label="Fruit" interface="popover" [formControl]="applicationFormControl"
							placeholder="Select fruit">

					<ion-select-option [value]="null">

						{{ 'analytic.widget.revenue.summary.by.form.source.all' | translate }}

					</ion-select-option>

					<ion-select-option [value]="ApplicationEnum.panel">

						{{ 'analytic.widget.revenue.summary.by.form.source.panel' | translate }}

					</ion-select-option>

					<ion-select-option [value]="ApplicationEnum.client">

						{{ 'analytic.widget.revenue.summary.by.form.source.client' | translate }}

					</ion-select-option>

				</ion-select>
			</div>
		</div>
		<div class="rounded-2xl bg-white p-2 flex flex-col gap-2 justify-center max-w-full overflow-auto">

			<ion-segment [formControl]="showMoneyOrCountFormControl">
				<ion-segment-button [value]="true">
					<ion-label>{{ 'analytic.widget.revenue.summary.by.form.kind.money' | translate }}</ion-label>
				</ion-segment-button>
				<ion-segment-button [value]="false">
					<ion-label>{{ 'analytic.widget.revenue.summary.by.form.kind.count' | translate }}</ion-label>
				</ion-segment-button>
			</ion-segment>
			<div id="total-revenue-diagram-container" style="width: 480px; height: 240px"></div>

		</div>
		<div class="text-neutral-400 text-sm">
			{{ 'analytic.widget.revenue.summary.by.description' | translate }}
		</div>
	`,
	imports: [
		ReactiveFormsModule,
		TranslatePipe,
		IonSegment,
		IonLabel,
		IonSegmentButton,
		IonSelectOption,
		IonSelect,
	],
	host: {
		class: 'block max-w-full rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2'
	}
})
export class TotalRevenueDiagramComponent extends Reactive implements AfterViewInit, OnDestroy {

	public readonly analytic = input.required<Analytic.I | Analytic.ISpecialist>();

	private root!: am5.Root;

	private readonly platformId = inject(PLATFORM_ID);
	private readonly zone = inject(NgZone);
	private readonly store = inject(Store);
	private readonly translateService = inject(TranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	protected readonly baseCurrency = this.store.selectSnapshot(BusinessProfileState.baseCurrency) ?? CurrencyCodeEnum.USD;

	protected readonly ApplicationEnum = ApplicationEnum;

	protected readonly applicationFormControl = new FormControl<null | ApplicationEnum>(null);
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
		this.applicationFormControl.valueChanges.pipe(
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

			const root = am5.Root.new("total-revenue-diagram-container");

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

		const application = this.applicationFormControl.value;
		const moneyOrCount = this.showMoneyOrCountFormControl.value;

		if (moneyOrCount) {

			let statuses = analytic.summary.revenue.total.by.status;

			if (application) {
				statuses = analytic.summary.revenue.total.by.source[application];
			}

			Object.keys(statuses).forEach((status) => {
				const orderServiceStatus = status as OrderServiceStatusEnum;
				data.push({
					name: this.translateService.instant(`event.keyword.status.plural.${orderServiceStatus}`),
					value: statuses[orderServiceStatus][this.baseCurrency]
				});
			});

		} else {

			let statuses = analytic.counter.orderService.by.status;

			if (application) {
				statuses = analytic.counter.orderService.by.source[application];
			}

			Object.keys(statuses).forEach((status) => {
				const orderServiceStatus = status as OrderServiceStatusEnum;
				data.push({
					name: this.translateService.instant(`event.keyword.status.plural.${orderServiceStatus}`),
					value: statuses[orderServiceStatus]
				});
			});

		}

		return data;
	}
}
