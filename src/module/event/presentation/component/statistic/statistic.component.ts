import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {
	DatetimePeriodEnum,
	IonSelectEventStatusComponent
} from "@event/presentation/component/statistic/component/ion-select-datetime-period.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {FormControl} from "@angular/forms";
import {Store} from "@ngxs/store";
import {MemberState} from "@member/state/member/member.state";
import {combineLatest, filter, map, Observable} from "rxjs";
import {StatisticQueries} from "@event/state/statistic/statistic.queries";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe, CurrencyPipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {RIMember} from "@member/domain";
import {ClientState} from "@client/state/client/client.state";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {StatisticAction} from "@event/state/statistic/statistic.action";
import {DateTime} from "luxon";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {is} from "thiis";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {IClient} from "@client/domain";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'event-statistic-component',
	templateUrl: './statistic.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonicModule,
		IonSelectEventStatusComponent,
		DefaultPanelComponent,
		NgForOf,
		AsyncPipe,
		NgIf,
		CurrencyPipe,
		LoaderComponent,
		TranslateModule,
		DecimalPipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticComponent extends Reactive implements AfterViewInit {

	public readonly datetimePeriodControl = new FormControl<DatetimePeriodEnum>(DatetimePeriodEnum.TODAY, {
		nonNullable: true
	});

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly store = inject(Store);

	@SelectSnapshot(ClientState.item)
	public readonly clientItem: IClient | undefined;

	public readonly loader$: Observable<boolean> = this.store.select(StatisticQueries.loader);

	public summary: {
		amount: number;
		currency: CurrencyCodeEnum;
		count: number;
		serviceCounter: {
			[key: string]: {
				count: number;
				service: IOrderServiceDto;
			}
		};
		topService: {
			count: number;
			service: IOrderServiceDto | undefined;
		};
	} = {
		amount: 0,
		count: 0,
		currency: CurrencyCodeEnum.USD,
		serviceCounter: {},
		topService: {
			count: 0,
			service: undefined
		}
	};

	public readonly statisticPerMember$: Observable<{
		member: RIMember;
		// Total amount of success, failed, canceled, services and total amount of services and total amount of earnings
		services: {
			success: {
				currency: CurrencyCodeEnum;
				amount: number;
				count: number;
			};
		};
	}[]> = combineLatest([
		this.store.select(MemberState.tableStateItems),
		this.store.select(StatisticQueries.data),
		this.datetimePeriodControl.valueChanges,
		this.store.select(ClientState.baseCurrency).pipe(
			filter(is.not_undefined<CurrencyCodeEnum>)
		)
	]).pipe(
		this.takeUntil(),
		map(({0: members, 1: statistic, 2: datetimePeriod, 3: baseCurrency}) => {

			this.summary = {
				amount: 0,
				count: 0,
				currency: baseCurrency,
				serviceCounter: {},
				topService: {
					count: 0,
					service: undefined
				}
			};

			const statisticPerMemberId = statistic.reduce((acc, item) => {

				if (item.status !== OrderServiceStatusEnum.done) {
					return acc;
				}

				this.summary.amount += item.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0;
				this.summary.count += 1;
				this.summary.serviceCounter[item.serviceSnapshot._id] = {
					count: (this.summary.serviceCounter[item.serviceSnapshot._id]?.count ?? 0) + 1,
					service: item
				};

				if (!this.summary.topService.service) {
					this.summary.topService = {
						count: this.summary.serviceCounter[item.serviceSnapshot._id].count,
						service: this.summary.serviceCounter[item.serviceSnapshot._id].service
					};
				} else {
					if (this.summary.serviceCounter[item.serviceSnapshot._id].count > this.summary.topService.count) {
						this.summary.topService = {
							count: this.summary.serviceCounter[item.serviceSnapshot._id].count,
							service: this.summary.serviceCounter[item.serviceSnapshot._id].service
						};
					}
				}

				item.orderAppointmentDetails.specialists.forEach((specialist) => {

					const memberId = specialist.member._id

					acc[memberId] = acc[memberId] ?? [];

					acc[memberId].push(item);

				});

				return acc;

			}, {} as { [key: string]: IOrderServiceDto[] });

			return members.map((member) => {

				const success: {
					currency: CurrencyCodeEnum;
					amount: number;
					count: number;
				} = {
					currency: baseCurrency,
					amount: 0,
					count: 0
				};

				const foundServices = statisticPerMemberId[member._id] ?? [];

				foundServices.forEach((service) => {
					const serviceCurrency = (service.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.currency ?? CurrencyCodeEnum.USD) as CurrencyCodeEnum;
					if (serviceCurrency !== baseCurrency) {
						return;
					}
					const servicePrice = service.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0;
					success.amount += servicePrice;
					success.count += 1;
				});

				const services = {
					success,
				};
				return {
					member,
					services
				};
			});
		})
	);

	public ngAfterViewInit(): void {
		this.datetimePeriodControl.valueChanges.pipe(this.takeUntil()).subscribe((datetimePeriod) => {
			let start = DateTime.now().startOf('day');
			let end = DateTime.now().endOf('day');
			switch (datetimePeriod) {
				case DatetimePeriodEnum.YESTERDAY:
					start = start.minus({days: 1});
					end = end.minus({days: 1});
					break;
				case DatetimePeriodEnum.THIS_WEEK:
					start = start.startOf('week');
					break;
				case DatetimePeriodEnum.LAST_WEEK:
					start = start.startOf('week').minus({weeks: 1});
					end = end.startOf('week').minus({days: 1});
					break;
				case DatetimePeriodEnum.THIS_MONTH:
					start = start.startOf('month');
					break;
				case DatetimePeriodEnum.LAST_MONTH:
					start = start.startOf('month').minus({months: 1});
					end = end.startOf('month').minus({days: 1});
					break;
				case DatetimePeriodEnum.THIS_YEAR:
					start = start.startOf('year');
					break;
				case DatetimePeriodEnum.LAST_YEAR:
					start = start.startOf('year').minus({years: 1});
					end = end.startOf('year').minus({days: 1});
					break;
			}
			this.store.dispatch(new StatisticAction.SetDate({
				start: start.toJSDate().toISOString(),
				end: end.toJSDate().toISOString()
			}));
			this.router.navigate([], {
				queryParams: {
					period: datetimePeriod
				},
				queryParamsHandling: 'merge'
			});
		});
		const {period} = this.activatedRoute.snapshot.queryParams as Params & {
			period?: DatetimePeriodEnum;
		};

		this.datetimePeriodControl.setValue(period ?? DatetimePeriodEnum.TODAY);
	}

}
