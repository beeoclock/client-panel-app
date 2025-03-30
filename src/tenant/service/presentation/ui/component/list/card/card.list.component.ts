import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, CurrencyPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {ILanguageVersion} from "@tenant/service/domain";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {DurationVersionHtmlHelper} from "@shared/helper/duration-version.html.helper";
import EService from "@tenant/service/domain/entity/e.service";
import {
	AutoRefreshButtonComponent
} from "@tenant/service/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@shared/presentation/component/not-found-table-data/not-found-table-data.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {CardIonListSmartComponent} from "@src/component/smart/card-ion-list/card-ion-list.smart.component";

@Component({
	selector: 'service-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		CardComponent,
		AsyncPipe,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		CardIonListSmartComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
	host: {
		class: 'block flex-1'
	},
})
export class CardListComponent extends TableComponent<EService> {

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

	public showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public getFirstLanguageVersion(languageVersions: ILanguageVersion[] = []): ILanguageVersion {
		const firstFoundOption = languageVersions.find(({language}) => language === this.translateService.currentLang);
		return firstFoundOption ?? languageVersions[0];
	}

	public override open(item: EService): void {
		this.store.dispatch(new ServiceActions.OpenDetails(item));
	}

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}

}
