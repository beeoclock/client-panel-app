import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe} from "@angular/common";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {ILanguageVersion} from "@src/core/business-logic/service";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {LanguageCodeEnum} from "@core/shared/enum";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ITableState} from "@utility/domain/table.state";
import {IService} from "@src/core/business-logic/service/interface/i.service";
import EService from "@core/business-logic/service/entity/e.service";

@Component({
	selector: 'service-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		RowActionButtonComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	]
})
export class TableListComponent extends TableComponent<EService> {

	public readonly translateService = inject(TranslateService);
	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	public override readonly tableState = input.required<ITableState<EService>>();

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
					minWidth: '150px',
				},
			},
			order: {
				style: {
					minWidth: '126px',
				},
			},
			duration: {
				style: {
					minWidth: '150px',
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
				classList: ['bg-white', 'justify-center'],
				style: {
					minWidth: '75px',
				},
			},
		},
	}

	public override open(item: IService.DTO) {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

}
