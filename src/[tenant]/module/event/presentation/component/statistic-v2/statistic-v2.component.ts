import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	OnInit,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngxs/store";
import {filter, map, startWith, tap} from "rxjs";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe} from "@angular/common";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {DateTime} from "luxon";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {is} from "@core/shared/checker";
import {RIClient} from "@core/business-logic/business-profile";
import {TranslateModule} from "@ngx-translate/core";
import {
	DateSliderControlComponent
} from "@analytic/presentation/component/control/date-slider/date-slider.control.component";
import {IntervalTypeEnum} from "@analytic/domain/enum/interval.enum";
import {
	DateRangeReportAnalyticState,
	IDateRangeAnalyticState
} from "@analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {
	DateRangeReportAnalyticActions
} from "@analytic/infrastructure/store/date-range-report/date-range-report.analytic.actions";
import {
	MemberRadioTailwindcssComponent
} from "@utility/presentation/component/input/tailwindcss/radio/member.radio.tailwindcss.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {
	RevenueSummaryDiagramComponent
} from "@event/presentation/component/statistic-v2/components/diagrams/revenue-summary/revenue-summary.diagram.component";
import {
	TotalRevenueDiagramComponent
} from "@event/presentation/component/statistic-v2/components/diagrams/total-revenue/total-revenue.diagram.component";
import {
	OrdersCounterStatisticComponent
} from "@event/presentation/component/statistic-v2/components/table/total/counter/orders.counter.statistic.component";
import {
	OrderServicesCounterStatisticComponent
} from "@event/presentation/component/statistic-v2/components/table/total/counter/order-services.counter.statistic.component";
import {
	CustomersCounterStatisticComponent
} from "@event/presentation/component/statistic-v2/components/table/total/counter/customers.counter.statistic.component";
import {
	ServicesCounterStatisticComponent
} from "@event/presentation/component/statistic-v2/components/table/total/counter/services.counter.statistic.component";
import {
	RevenueStatisticComponent
} from "@event/presentation/component/statistic-v2/components/table/total/counter/revenue.statistic.component";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {MemberDataState} from "@member/presentation/state/data/member.data.state";

@Component({
	selector: 'event-statistic-v2-component',
	templateUrl: './statistic-v2.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DefaultPanelComponent,
		AsyncPipe,
		LoaderComponent,
		TranslateModule,
		DateSliderControlComponent,
		MemberRadioTailwindcssComponent,
		RevenueSummaryDiagramComponent,
		OrdersCounterStatisticComponent,
		OrderServicesCounterStatisticComponent,
		CustomersCounterStatisticComponent,
		ServicesCounterStatisticComponent,
		TotalRevenueDiagramComponent,
		RevenueStatisticComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticV2Component extends Reactive implements OnInit, AfterViewInit {

	readonly dateSliderControlComponent = viewChild.required(DateSliderControlComponent);

	public readonly items: {
		id: string;
		label: string;
		avatar: string;
	}[] = [];

	public readonly control = new FormControl<string>('', {
		nonNullable: true
	});
	public readonly filterStateFormGroup = new FormGroup({
		interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.day, {
			nonNullable: true
		}),
		selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
			nonNullable: true
		}),
	});

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly store = inject(Store);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly analyticsService = inject(AnalyticsService);
	private readonly router = inject(Router);

	public readonly analytic$ = this.store.select(DateRangeReportAnalyticState.analytic).pipe(
		filter(is.not_null<IDateRangeAnalyticState['analytic']>),
		tap(() => {
			this.changeDetectorRef.detectChanges();
		})
	);

	public readonly baseCurrency$ = this.store.select(BusinessProfileState.baseCurrency).pipe(
		filter(is.not_null<CurrencyCodeEnum>),
		tap(() => {
			this.changeDetectorRef.detectChanges();
		})
	);

	public readonly clientItem$ = this.store.select(BusinessProfileState.item).pipe(
		filter(is.not_null<RIClient>),
		tap((clientItem) => {
			this.items.unshift({
				id: clientItem._id,
				label: clientItem.name,
				avatar: clientItem.logo?.url || ''
			});
			this.control.setValue(clientItem._id);
			this.changeDetectorRef.detectChanges();
		})
	);
	public readonly activeMembers$ = this.store.select(MemberDataState.activeMembers).pipe(
		filter(is.not_null<IMember.EntityRaw[]>),
		tap((activeMembers) => {
			activeMembers.forEach((member) => {
				this.items.push({
					id: member._id,
					label: `${member.firstName} ${member.lastName}`,
					avatar: member.avatar?.url || ''
				});
			});
			this.changeDetectorRef.detectChanges();
		})
	);

	public ngOnInit() {

		this.filterStateFormGroup.valueChanges.pipe(
			this.takeUntil()
		).subscribe(() => {
			this.store.dispatch([
				new DateRangeReportAnalyticActions.UpdateQueryParams({
					...this.filterStateFormGroup.getRawValue(),
					specialistIds: []
				}),
				new DateRangeReportAnalyticActions.GetList()
			]);
		});

		const {interval, selectedDate} = this.activatedRoute.snapshot.queryParams as Params & {
			interval?: IntervalTypeEnum;
			selectedDate?: string;
		};

		this.filterStateFormGroup.patchValue({
			interval: interval ?? IntervalTypeEnum.day,
			selectedDate: selectedDate ?? DateTime.now().toJSDate().toISOString()
		});
	}

	public ngAfterViewInit() {
		this.filterStateFormGroup.valueChanges.pipe(
			this.takeUntil(),
			startWith(this.filterStateFormGroup.value),
			map(({interval, selectedDate}) => {

				if (!selectedDate || !interval) {
					return;
				}

				const start = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
				const end = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();
				const payload: {
					start: string;
					end: string;
				} = {
					start,
					end,
				};
				this.analyticsService.logEvent('statistic_period_changed', {
					period: interval,
					payload: JSON.stringify(payload),
				});
				// TODO add to store
				// this.store.dispatch(new DateRangeReportAnalyticActions.set(payload));
				this.router.navigate([], {
					queryParams: {
						interval,
						selectedDate
					},
					queryParamsHandling: 'merge'
				});
			})
		).subscribe();

		this.dateSliderControlComponent().initialize();

	}

}
