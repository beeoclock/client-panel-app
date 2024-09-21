import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {
	IDateRangeAnalyticState
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.state";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {RIMember} from "@member/domain";
import {
	CustomerTableComponent
} from "@module/analytic/internal/presentation/component/date-range-report/dummy/customer-table/customer-table.component";

@Component({
	selector: 'app-overview-member-component',
	templateUrl: './overview-member.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CurrencyPipe,
		TranslateModule,
		CustomerTableComponent
	]
})
export class OverviewMemberComponent implements OnInit, OnChanges {

	@Input({required: true})
	baseCurrency!: CurrencyCodeEnum;

	@Input({required: true})
	public analytic!: NonNullable<IDateRangeAnalyticState['analytic']>;

	@Input({required: true})
	public selectedMemberId!: string;

	@Input({required: true})
	public activeMembers!: RIMember[];

	public activeMember!: RIMember;

	public ngOnInit() {
		this.initActiveMember();
	}

	public ngOnChanges() {
		this.initActiveMember();
	}

	public initActiveMember() {
		this.activeMember = this.activeMembers.find((member) => member._id === this.selectedMemberId)!;
	}

}
