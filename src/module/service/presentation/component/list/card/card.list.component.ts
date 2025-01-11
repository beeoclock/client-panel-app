import {Component, inject, OnChanges, SimpleChange, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ILanguageVersion} from "@service/domain";
import {ServiceActions} from "@service/state/service/service.actions";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ServiceTableService} from "@service/presentation/component/list/service.table.service";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Component({
	selector: 'service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		TableStatePaginationComponent,
		TranslateModule,
		CardComponent,
		NgIf,
		AsyncPipe,
		RowActionButtonComponent
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
		ServiceTableService
	],
})
export class CardListComponent extends TableComponent<IServiceDto> implements OnChanges {

	public readonly translateService = inject(TranslateService);
	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public list: IServiceDto[] = [];

	public override ngOnChanges(changes: SimpleChanges & { tableState: SimpleChange }): void {

		super.ngOnChanges(changes);

		if (changes.tableState.firstChange) {
			this.list = [...changes.tableState.currentValue.items];
		} else {

			if (changes.tableState.currentValue.page === changes.tableState.previousValue.page) {
				this.list.length = this.list.length - changes.tableState.previousValue.items.length;
				this.list = [...this.list, ...changes.tableState.currentValue.items];
			} else {
				if (changes.tableState.currentValue.page > 1) {
					this.list = [...this.list, ...changes.tableState.currentValue.items];
				} else {
					this.list = [...changes.tableState.currentValue.items];
				}
			}

		}

	}

	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
		const firstFoundOption = languageVersions.find(({language}) => language === this.translateService.currentLang);
		return firstFoundOption ?? languageVersions[0];
	}

	public override open(item: IServiceDto): void {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

}
