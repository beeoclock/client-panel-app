import {Component, HostBinding, Input} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {IEvent_V2} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {V2GeneralDetailsComponent} from "@event/presentation/component/details/v2.general.details.component";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";

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
		LoaderComponent,
		V2GeneralDetailsComponent
	],
	template: `
		<ng-container *ngIf="event; else LoadingTemplate">

			<event-v2-general-details [event]="event"/>
<!--			<event-buttons-details [event]="event"/>-->
<!--			<event-meta-details [event]="event"/>-->

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
