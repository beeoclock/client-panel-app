import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {Observable, tap} from 'rxjs';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {Select} from "@ngxs/store";
import {EventState} from "@event/state/event/event.state";
import {RMIEvent} from "@event/domain";
import {TranslateModule} from "@ngx-translate/core";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {ContainerDetailsComponent} from "@event/presentation/component/details/container.details.component";

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
		ContainerDetailsComponent,
	],
	standalone: true
})
export default class Index {

	@ViewChild(BackButtonComponent)
	private readonly backButton!: BackButtonComponent;

	@Select(EventState.itemData)
	private readonly item$!: Observable<RMIEvent | null>;

	public readonly event$ = this.item$.pipe(
		tap((event) => {
			if (!event) {
				this.backButton.navigateToBack();
			}
		})
	);

}
