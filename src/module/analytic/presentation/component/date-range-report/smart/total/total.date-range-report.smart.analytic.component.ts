import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticState,
	IDateRangeAnalyticState
} from "@module/analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {AsyncPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {MemberState} from "@member/infrastructure/state/member/member.state";
import {IonicModule} from "@ionic/angular";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {filter, tap} from "rxjs";
import {
	MemberRadioTailwindcssComponent
} from "@utility/presentation/component/input/tailwindcss/radio/member.radio.tailwindcss.component";
import {is} from "@src/core/shared/checker";
import {RIClient} from "@client/domain";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {RIMember} from "@src/core/business-logic/member";
import {
	DateSliderControlComponent
} from "@module/analytic/presentation/component/control/date-slider/date-slider.control.component";
import {Reactive} from "@utility/cdk/reactive";
import {
	DateRangeReportAnalyticActions
} from "@module/analytic/infrastructure/store/date-range-report/date-range-report.analytic.actions";
import {
	CardOverviewComponent
} from "@module/analytic/presentation/component/date-range-report/dummy/overview-total/card/card.overview.component";
import {
	CustomerListGroupComponent
} from "@module/analytic/presentation/component/date-range-report/dummy/customer-list-group/customer-list-group.component";
import {IntervalTypeEnum} from "@module/analytic/domain/enum/interval.enum";
import {DateTime} from "luxon";

@Component({
	standalone: true,
	selector: 'app-total-date-range-report-smart-analytic-component',
	templateUrl: './total.date-range-report.smart.analytic.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		TranslateModule,
		IonicModule,
		ReactiveFormsModule,
		MemberRadioTailwindcssComponent,
		DateSliderControlComponent,
		CardOverviewComponent,
		CustomerListGroupComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalDateRangeReportSmartAnalyticComponent extends Reactive implements OnInit {

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

	public readonly analytic$ = this.store.select(DateRangeReportAnalyticState.analytic).pipe(
		filter(is.not_null<IDateRangeAnalyticState['analytic']>),
		tap(() => {
			this.changeDetectorRef.detectChanges();
		})
	);

	public readonly baseCurrency$ = this.store.select(ClientState.baseCurrency).pipe(
		filter(is.not_null<CurrencyCodeEnum>),
		tap(() => {
			this.changeDetectorRef.detectChanges();
		})
	);

	public readonly clientItem$ = this.store.select(ClientState.item).pipe(
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
	public readonly activeMembers$ = this.store.select(MemberState.activeMembers).pipe(
		filter(is.not_null<RIMember[]>),
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
	}
}
