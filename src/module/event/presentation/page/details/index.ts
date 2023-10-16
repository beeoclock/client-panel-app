import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {Observable} from 'rxjs';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {Select} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {IEvent} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";

@Component({
	selector: 'event-detail-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		AsyncPipe,
		SpinnerComponent,
		DeleteButtonComponent,
		RouterLink,
		NgForOf,
		DropdownComponent,
		TranslateModule,
		EditLinkComponent,
		NgTemplateOutlet,
		CardComponent,
		MetaDetailsComponent,
		ButtonsDetailsComponent,
		GeneralDetailsComponent,
		PrimaryButtonDirective,
		BackButtonComponent,
		DefaultPanelComponent,
	],
	standalone: true
})
export default class Index {

	// TODO add base index of details with store and delete method

	@Select(EventState.itemData)
	public readonly item$!: Observable<IEvent>;

}
