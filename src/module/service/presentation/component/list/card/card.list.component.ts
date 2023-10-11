import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ITableState} from "@utility/domain/table.state";
import {TableComponent} from "@utility/table.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ILanguageVersion, IService} from "@service/domain";
import {ServiceActions} from "@service/state/service/service.actions";
import {LanguageCodeEnum} from "@utility/domain/enum";

@Component({
	selector: 'service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		ActionComponent,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		EventStatusStyleDirective,
		CurrencyPipe,
		HumanizeDurationPipe,
		CardComponent,
		NgIf
	]
})
export class CardListComponent extends TableComponent {

	public override readonly actions = ServiceActions;
	public readonly translateService = inject(TranslateService);

	public get currentLanguageCode(): LanguageCodeEnum {
		return this.translateService.getDefaultLang() as LanguageCodeEnum;
	}

	@Input()
	public tableState!: ITableState<IService>;

	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
		const firstOption = languageVersions.find(({language}) => language === this.currentLanguageCode);
		return firstOption ?? languageVersions[0];
	}

}
