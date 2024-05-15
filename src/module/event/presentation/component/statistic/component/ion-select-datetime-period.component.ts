import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";

export enum DatetimePeriodEnum {
	TODAY = 'TODAY',
	YESTERDAY = 'YESTERDAY',
	THIS_WEEK = 'THIS_WEEK',
	LAST_WEEK = 'LAST_WEEK',
	THIS_MONTH = 'THIS_MONTH',
	LAST_MONTH = 'LAST_MONTH',
	THIS_YEAR = 'THIS_YEAR',
	LAST_YEAR = 'LAST_YEAR',
}

@Component({
	selector: 'ion-select-statistic-datetime-period',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control"
			[multiple]="multiple"
			class="!min-h-0"
			fill="solid"
			interface="popover">
			<ion-select-option
				*ngFor="let periodOption of periodOptionList"
				[value]="periodOption.id">
				{{ periodOption.label }}
			</ion-select-option>
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		IonicModule,
		NgForOf
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectEventStatusComponent implements OnInit {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	@Input()
	public ignoreStatusList: DatetimePeriodEnum[] = [];

	@Input()
	public multiple = false;

	private readonly translateService = inject(TranslateService);

	public readonly periodOptionList: { id: DatetimePeriodEnum; label: string; }[] = [];

	public ngOnInit(): void {
		this.initEventStatusList();
	}

	private initEventStatusList() {
		(Object.keys(DatetimePeriodEnum) as DatetimePeriodEnum[])
			.forEach((period) => {
				if (this.ignoreStatusList.includes(period)) {
					return;
				}
				this.periodOptionList.push({
					id: period,
					label: this.translateService.instant(`event.statistic.period.${period}`)
				});
			});
	}

}
