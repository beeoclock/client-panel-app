import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticState,
	IDateRangeAnalyticState
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.state";
import {AsyncPipe, CurrencyPipe, KeyValuePipe, NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ClientState} from "@client/state/client/client.state";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {MemberState} from "@member/state/member/member.state";
import {IonicModule} from "@ionic/angular";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
	SelectTailwindcssComponent
} from "@utility/presentation/component/input/tailwindcss/select/select.tailwindcss.component";
import {filter, tap} from "rxjs";
import {
	MemberRadioTailwindcssComponent
} from "@utility/presentation/component/input/tailwindcss/radio/member.radio.tailwindcss.component";
import {
	OverviewMemberComponent
} from "@module/analytic/internal/presentation/component/date-range-report/smart/overview-member/overview-member.component";
import {is} from "@utility/checker";
import {RIClient} from "@client/domain";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {RIMember} from "@member/domain";
import {
	DateSliderControlComponent
} from "@module/analytic/internal/presentation/component/control/date-slider/date-slider.control.component";

@Component({
	standalone: true,
	selector: 'app-total-date-range-report-smart-analytic-component',
	templateUrl: './total.date-range-report.smart.analytic.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		TranslateModule,
		CurrencyPipe,
		HumanizeDurationPipe,
		KeyValuePipe,
		IonicModule,
		NgForOf,
		ReactiveFormsModule,
		SelectTailwindcssComponent,
		MemberRadioTailwindcssComponent,
		OverviewMemberComponent,
		DateSliderControlComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalDateRangeReportSmartAnalyticComponent {

	public readonly items: {
		id: string;
		label: string;
		avatar: string;
	}[] = [];

	public readonly control = new FormControl();
	public readonly filterFormGroup = new FormGroup({
		from: new FormControl(),
		to: new FormControl()
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

}
