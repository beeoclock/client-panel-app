import {Component, HostBinding, Input} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {IEvent_V2} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@event/presentation/component/details/v2.general.details.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {V2ButtonsDetailsComponent} from "@event/presentation/component/details/v2.buttons.details.component";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	imports: [
		AsyncPipe,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		NgIf,
		LoaderComponent,
		V2GeneralDetailsComponent,
		V2ButtonsDetailsComponent
	],
	template: `
		<ng-container *ngIf="event; else LoadingTemplate">

			<event-v2-general-details [event]="event"/>
			<app-event-v2-buttons-details [event]="event"/>
			<event-meta-details [event]="event.originalData.order"/>

		</ng-container>

		<ng-template #LoadingTemplate>
			<utility-loader/>
		</ng-template>
	`
})
export class ContainerDetailsComponent {

	@Input({required: true})
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@HostBinding()
	public class = 'pb-48 block';

}
