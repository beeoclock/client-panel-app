import {Component, inject, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {ILanguageVersion, IService} from "@service/domain";
import {ServiceActions} from "@service/state/service/service.actions";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {HumanizeDurationHelper} from "@utility/helper/humanize/humanize-duration.helper";

@Component({
	selector: 'service-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		CurrencyPipe,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent
	],
	providers: [
		CurrencyPipe
	]
})
export class TableListComponent extends TableComponent<IService> {

	public override readonly actions = ServiceActions;

	public readonly translateService = inject(TranslateService);
	public readonly currencyPipe = inject(CurrencyPipe);
	public readonly humanizeDurationHelper = inject(HumanizeDurationHelper);

	public get currentLanguageCode(): LanguageCodeEnum {
		return this.translateService.getDefaultLang() as LanguageCodeEnum;
	}

	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
		const firstOption = languageVersions.find(({language}) => language === this.currentLanguageCode);
		return firstOption ?? languageVersions[0];
	}

	public readonly tableConfiguration = {
		columns: {
			title: {
				style: {
					minWidth: '400px',
					flexGrow: 1,
				},
			},
			active: {
				style: {
					minWidth: '120px',
				},
			},
			price: {
				style: {
					minWidth: '300px',
				},
			},
			duration: {
				style: {
					minWidth: '300px',
				},
			},
			createdAt: {
				style: {
					minWidth: '200px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '200px',
				},
			},
			action: {
				classList: ['bg-white'],
				style: {
					minWidth: '66px',
				},
			},
		},
	}

	public getPriceValue(item: IService) : string {
		const result: string[] = [];
		item.durationVersions.forEach((durationVersion) => {
			const price = this.currencyPipe.transform(durationVersion.prices[0].price, item.durationVersions[0].prices[0].currency, 'symbol-narrow');
			if (price) {
				result.push(price);
			}
		});
		return result.join(' / ');
	}

	public getDurationValue(item: IService): string {
		// item.durationVersions[0].durationInSeconds | humanizeDuration
		const result: string[] = [];
		item.durationVersions.forEach((durationVersion) => {
			const duration = this.humanizeDurationHelper.fromSeconds(durationVersion.durationInSeconds);
			if (duration) {
				result.push(duration);
			}
		});
		return result.join(' / ');
	}
}
