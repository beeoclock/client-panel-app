import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {FormControl, FormGroup} from "@angular/forms";
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
import {is} from "@utility/checker";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {IClient} from "@client/domain";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {IdentityState} from "@identity/state/identity/identity.state";
import {
	DateSliderControlComponent
} from "@module/analytic/internal/presentation/component/control/date-slider/date-slider.control.component";
import {IntervalTypeEnum} from "@module/analytic/internal/domain/enum/interval.enum";

@Component({
	selector: 'event-statistic-component',
	templateUrl: './statistic.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonicModule,
		DefaultPanelComponent,
		NgForOf,
		AsyncPipe,
		NgIf,
		CurrencyPipe,
		LoaderComponent,
		TranslateModule,
		DecimalPipe,
		DateSliderControlComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticComponent extends Reactive implements AfterViewInit {

	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);

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
		this.store.select(MemberState.tableStateItems).pipe(
			map((members) => {
				return members.filter((member) => member.profileStatus === MemberProfileStatusEnum.active);
			})
		),
		this.store.select(StatisticQueries.data),
		this.filterStateFormGroup.valueChanges,
		this.store.select(ClientState.baseCurrency).pipe(
			filter(is.not_undefined<CurrencyCodeEnum>)
		)
	]).pipe(
		this.takeUntil(),
		map(({
				 0: members,
				 1: orderPage,
				 2: filterState,
				 3: baseCurrency
			 }) => {

			this.ngxLogger.info('StatisticComponent', 'statisticPerMember$', {
				members,
				orderPage,
				filterState,
				baseCurrency,
			});

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

			const statisticPerMemberId = orderPage.items.reduce((acc, item) => {

				item.services.forEach((orderServiceDto) => {

					if (orderServiceDto.status !== OrderServiceStatusEnum.done) {
						return;
					}

					this.summary.amount += orderServiceDto.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0;
					this.summary.count += 1;
					this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id] = {
						count: (this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id]?.count ?? 0) + 1,
						service: orderServiceDto
					};

					if (!this.summary.topService.service) {
						this.summary.topService = {
							count: this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id].count,
							service: this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id].service
						};
					} else {
						if (this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id].count > this.summary.topService.count) {
							this.summary.topService = {
								count: this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id].count,
								service: this.summary.serviceCounter[orderServiceDto.serviceSnapshot._id].service
							};
						}
					}

					orderServiceDto.orderAppointmentDetails.specialists.forEach((specialist) => {

						const memberId = specialist.member._id;

						acc[memberId] = acc[memberId] ?? [];

						acc[memberId].push(orderServiceDto);

					});

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

						this.ngxLogger.warn('StatisticComponent', 'Currency mismatch', {
							serviceCurrency,
							baseCurrency
						});

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
		this.filterStateFormGroup.valueChanges.pipe(
			this.takeUntil(),
		).subscribe(({interval, selectedDate}) => {

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

}
