import {Component, effect, inject, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe} from "@angular/common";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ILanguageVersion} from "@src/core/business-logic/service";
import {ServiceActions} from "@service/infrastructure/state/service/service.actions";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {ServiceTableService} from "@service/presentation/component/list/service.table.service";
import {IService} from "@src/core/business-logic/service/interface/i.service";

@Component({
	selector: 'service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		TranslateModule,
		CardComponent,
		AsyncPipe
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
		ServiceTableService
	],
})
export class CardListComponent extends TableComponent<IService.DTO> {

	public readonly translateService = inject(TranslateService);
	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public list: IService.DTO[] = [];

	public constructor() {
		super();
		effect(() => {
			const tableState = this.tableState();
			const {page, items} = tableState;

			if (page === 1) {
				// Якщо це перша сторінка, оновлюємо список повністю
				this.list = [...items];
			} else if (this.list.length > 0 && page > 1) {
				// Якщо це не перша сторінка, додаємо нові елементи
				this.list = [...this.list, ...items];
			}
		})
	}

	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
		const firstFoundOption = languageVersions.find(({language}) => language === this.translateService.currentLang);
		return firstFoundOption ?? languageVersions[0];
	}

	public override open(item: IService.DTO): void {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

}
