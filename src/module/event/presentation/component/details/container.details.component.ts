import {Component, HostBinding, Input} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {RMIEvent} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	imports: [
		AsyncPipe,
		ButtonsDetailsComponent,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		NgIf,
		LoaderComponent
	],
	template: `
		<ng-container *ngIf="event; else LoadingTemplate">

			<event-general-details [event]="event"/>
			<event-buttons-details [event]="event"/>
			<event-meta-details [event]="event"/>

		</ng-container>

		<ng-template #LoadingTemplate>
			<utility-loader/>
		</ng-template>
	`
})
export class ContainerDetailsComponent {

	@Input()
	public event!: RMIEvent;

	@HostBinding()
	public class = 'pb-48 block';

}
