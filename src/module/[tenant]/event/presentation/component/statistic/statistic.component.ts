import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Store} from "@ngxs/store";
import {MemberState} from "@member/state/member/member.state";
import {combineLatest, filter, map, Observable, startWith} from "rxjs";
import {StatisticQueries} from "@event/state/statistic/statistic.queries";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe, CurrencyPipe, DecimalPipe, KeyValuePipe} from "@angular/common";
import {ClientState} from "@client/state/client/client.state";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {StatisticAction} from "@event/state/statistic/statistic.action";
import {DateTime} from "luxon";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {is} from "@utility/checker";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {IClient} from "@client/domain";
import {TranslateModule} from "@ngx-translate/core";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {IdentityState} from "@identity/state/identity/identity.state";
import {
	DateSliderControlComponent
} from "@analytic/internal/presentation/component/control/date-slider/date-slider.control.component";
import {IntervalTypeEnum} from "@analytic/internal/domain/enum/interval.enum";
import {statisticCalculator} from "@event/state/statistic/statistic.calculator";

@Component({
	selector: 'event-statistic-component',
	templateUrl: './statistic.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonicModule,
		DefaultPanelComponent,
		AsyncPipe,
		CurrencyPipe,
		LoaderComponent,
		TranslateModule,
		DecimalPipe,
		DateSliderControlComponent,
		KeyValuePipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticComponent extends Reactive implements AfterViewInit, OnInit {

	readonly dateSliderControlComponent = viewChild.required(DateSliderControlComponent);

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	private readonly analyticsService = inject(AnalyticsService);

	public readonly filterStateFormGroup = new FormGroup({
		interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.day, {
			nonNullable: true
		}),
		selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
			nonNullable: true
		}),
	});

	@SelectSnapshot(IdentityState.accountDetails)
	public readonly accountDetails!: {
		email?: string;
		id?: string;
		name?: string;
		userId?: string;
	};

	@SelectSnapshot(ClientState.item)
	public readonly clientItem: IClient | undefined;

	public readonly loader$: Observable<boolean> = this.store.select(StatisticQueries.loader);

	public start = DateTime.now().startOf('day');
	public end = DateTime.now().endOf('day');
	public periodTitle = '';

	public readonly baseCurrency$: Observable<CurrencyCodeEnum> = this.store.select(ClientState.baseCurrency).pipe(filter(is.not_undefined<CurrencyCodeEnum>));

	public readonly calculatedStatistic$: Observable<ReturnType<typeof statisticCalculator>> = combineLatest([
		this.store.select(MemberState.tableStateItems).pipe(
			map((members) => {
				return members.filter((member) => member.profileStatus === MemberProfileStatusEnum.active);
			})
		),
		this.store.select(StatisticQueries.calculated),
		this.baseCurrency$
	]).pipe(
		this.takeUntil(),
		map(({1: calculated}) => calculated),
	);

	public ngOnInit() {

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
					accountDetails: JSON.stringify(this.accountDetails)
				});
				this.store.dispatch(new StatisticAction.SetDate(payload));
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
