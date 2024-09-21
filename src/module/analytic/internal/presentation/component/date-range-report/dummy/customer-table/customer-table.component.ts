import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnChanges,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	IDateRangeAnalyticState
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.state";
import {CurrencyPipe} from "@angular/common";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {TranslateModule} from "@ngx-translate/core";

type ICustomerItem = {
	// data: NonNullable<IDateRangeAnalyticState['analytic']>['counter']['by']['specialist'][string & Types.ObjectId]['uniqueClient'][string & Types.ObjectId];
	// customer: NonNullable<IDateRangeAnalyticState['analytic']>['customer'][string & Types.ObjectId];
};

@Component({
	selector: 'app-customer-table-component',
	templateUrl: './customer-table.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CurrencyPipe,
		TranslateModule
	]
})
export class CustomerTableComponent implements OnChanges {

	@Input({required: true})
	public analytic!: NonNullable<IDateRangeAnalyticState['analytic']>;

	@Input({required: true})
	public selectedMemberId!: string;

	@Input({required: true})
	public baseCurrency!: CurrencyCodeEnum;

	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly table: ICustomerItem[] = [];

	private readonly cache: Map<string, ICustomerItem[]> = new Map();

	public ngOnChanges(changes: SimpleChanges) {

		this.calculateCustomerTable();

	}

	public get specialist() {

		// return this.analytic.counter.by.specialist[this.selectedMemberId];
		return null;

	}

	public calculateCustomerTable() {

		this.table.length = 0;

		if (this.cache.has(this.selectedMemberId)) {
			const cached = this.cache.get(this.selectedMemberId);
			if (cached?.length) {
				this.table.push(...cached);
				return;
			}
		}

		// const specialist = this.specialist;
		// Object.keys(specialist.uniqueClient).forEach((customerId) => {

			// this.table.push({
			// 	data: specialist.uniqueClient[customerId],
			// 	customer: this.analytic.customer[customerId]
			// });

		// });

		// Sort by total appointments
		// this.table.sort((a, b) => b.data.appointments.total - a.data.appointments.total);

		this.cache.set(this.selectedMemberId, this.table);
		this.changeDetectorRef.detectChanges();

	}

}
